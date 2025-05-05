module Parking exposing (..)

import Browser
import Dict exposing (Dict)
import Html exposing (..)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick)
import Http
import Json.Decode exposing (Decoder, field, int, list, map2, string)
import List exposing (map)
import Lots exposing (Lot, LotMeasurement, listParkingDecoder, parkingLatestDecoder)
import Time


type WebData r
    = Failure Http.Error
    | Loading
    | Success r


type alias API =
    String


type LotState
    = LotsLoading
    | LotsLoadingFailure
    | LotsLoaded
        { lotsInfo : List Lot
        , latestLotsInfo : Dict String (WebData LotMeasurement)
        }


type alias Model =
    ( API, LotState )


replaceModel : Model -> LotState -> Model
replaceModel v t =
    v |> Tuple.mapSecond (\_ -> t)


getAllLots : API -> Cmd Msg
getAllLots api =
    Http.get
        { url = api ++ "/ParkingLotInfo/GetAllLots"
        , expect = Http.expectJson GotLotInfo listParkingDecoder
        }


getLatestForLot : API -> String -> Cmd Msg
getLatestForLot api lotId =
    Http.get
        { url = api ++ "/ParkingLotMeasurement/GetLatest" ++ "?lotId=" ++ lotId
        , expect = Http.expectJson (GotLatestLotMeasurement lotId) parkingLatestDecoder
        }


type Msg
    = GotLotInfo (Result Http.Error (List Lot))
    | GotLatestLotMeasurement String (Result Http.Error LotMeasurement)
    | Tick Time.Posix


type alias Flags =
    { api_base : API
    }


init : Flags -> ( Model, Cmd Msg )
init f =
    ( ( f.api_base, LotsLoading )
    , getAllLots f.api_base
    )


lotIdFromDto : Lot -> String
lotIdFromDto l =
    l.lotId


lotIdsFromDtos : List Lot -> List String
lotIdsFromDtos =
    List.map lotIdFromDto


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Tick _ ->
            ( model, getAllLots (Tuple.first model) )

        GotLotInfo res ->
            case res of
                Ok lots ->
                    ( model
                        |> Tuple.mapSecond
                            (\_ ->
                                LotsLoaded
                                    { lotsInfo = lots
                                    , latestLotsInfo =
                                        lots
                                            |> List.map (\l -> ( lotIdFromDto l, Loading ))
                                            |> Dict.fromList
                                    }
                            )
                    , Cmd.batch
                        (lots
                            |> List.map lotIdFromDto
                            |> List.map (getLatestForLot (Tuple.first model))
                        )
                    )

                Err _ ->
                    ( model |> Tuple.mapSecond (\_ -> LotsLoadingFailure)
                    , Cmd.none
                    )

        GotLatestLotMeasurement lotId res ->
            case model of
                ( _, LotsLoaded d ) ->
                    case res of
                        Ok measurement ->
                            ( model
                                |> Tuple.mapSecond
                                    (\_ ->
                                        LotsLoaded
                                            { d
                                                | latestLotsInfo =
                                                    d.latestLotsInfo
                                                        |> Dict.insert lotId (Success measurement)
                                            }
                                    )
                            , Cmd.none
                            )

                        Err e ->
                            ( replaceModel model
                                (LotsLoaded
                                    { d
                                        | latestLotsInfo =
                                            d.latestLotsInfo
                                                |> Dict.insert lotId (Failure e)
                                    }
                                )
                            , Cmd.none
                            )

                _ ->
                    ( replaceModel model LotsLoadingFailure, Cmd.none )


viewLot : Lot -> WebData LotMeasurement -> Html Msg
viewLot lot li =
    div [ class "flex flex-col items-center border-2 p-2" ]
        [ p [ class "text-center text-4xl font-bold" ] [ text lot.lotName ]
        , p []
            [ case li of
                Success x ->
                    text (String.fromInt x.availableSpaces)

                Loading ->
                    div [ class "w-16 h-4 rounded-2xl bg-neutral-700/10 inline-block" ] []

                _ ->
                    text "???"
            , text " spaces available out of "
            , text (String.fromInt lot.spacesCount)
            ]
        ]


view : Model -> Html Msg
view (api, model) =
    case model of
        LotsLoaded d ->
            div [ class "grid grid-cols-2 w-full gap-4 p-4" ]
                (d.lotsInfo
                    |> List.filterMap (\l -> d.latestLotsInfo |> Dict.get l.lotId |> Maybe.map (viewLot l))
                )

        LotsLoadingFailure ->
            text "Failed to get lots"

        LotsLoading ->
            text "Loading..."


main : Program Flags Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = \_ -> Sub.none
        }
