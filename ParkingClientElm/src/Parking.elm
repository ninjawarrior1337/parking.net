module Parking exposing (..)

import Browser
import Dict exposing (Dict)
import Html exposing (..)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick)
import Http
import Json.Decode exposing (Decoder, field, int, list, map2, string)
import List exposing (map)
import Time


type alias LotDto =
    { lotId : String
    , spacesCount : Int
    }


type alias LotMeasurementDto =
    { timestamp : String
    , availableSpaces : Int
    }


type Promise r
    = Failure
    | Loading
    | Success r


type Model
    = LotsLoading
    | LotsLoadingFailure
    | LotsLoaded
        { lotsInfo : List LotDto
        , latestLotsInfo : Dict String (Promise LotMeasurementDto)
        }


getAllLots : Cmd Msg
getAllLots =
    Http.get
        { url = "http://maru:9327/api/ParkingLotInfo/GetAllLots"
        , expect = Http.expectJson GotLotInfo listParkingDecoder
        }


getLatestForLot : String -> Cmd Msg
getLatestForLot lotId =
    Http.get
        { url = "https://api.parking.csun.treelar.xyz/api/ParkingLotMeasurement/GetLatest" ++ "?lotId=" ++ lotId
        , expect = Http.expectJson (GotLatestLotMeasurement lotId) parkingLatestDecoder
        }


parkingInfoDecoder : Decoder LotDto
parkingInfoDecoder =
    map2 LotDto
        (field "lotId" string)
        (field "spacesCount" int)


parkingLatestDecoder : Decoder LotMeasurementDto
parkingLatestDecoder =
    map2 LotMeasurementDto
        (field "timestamp" string)
        (field "availableSpaces" int)


listParkingDecoder : Decoder (List LotDto)
listParkingDecoder =
    list parkingInfoDecoder


type Msg
    = GotLotInfo (Result Http.Error (List LotDto))
    | GotLatestLotMeasurement String (Result Http.Error LotMeasurementDto)
    | Tick (Time.Posix)


init : ( Model, Cmd Msg )
init =
    ( LotsLoading
    , getAllLots
    )


lotIdFromDto : LotDto -> String
lotIdFromDto l =
    l.lotId


lotIdsFromDtos : List LotDto -> List String
lotIdsFromDtos =
    List.map lotIdFromDto


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Tick _ ->
            (model, getAllLots)
        GotLotInfo res ->
            case res of
                Ok lots ->
                    ( LotsLoaded
                        { lotsInfo = lots
                        , latestLotsInfo =
                            lots
                                |> List.map (\l -> ( lotIdFromDto l, Loading ))
                                |> Dict.fromList
                        }
                    , Cmd.batch
                        (lots
                            |> List.map lotIdFromDto
                            |> List.map getLatestForLot
                        )
                    )

                Err _ ->
                    ( LotsLoadingFailure
                    , Cmd.none
                    )

        GotLatestLotMeasurement lotId res ->
            case model of
                LotsLoaded d ->
                    case res of
                        Ok measurement ->
                            ( LotsLoaded
                                { d
                                    | latestLotsInfo =
                                        d.latestLotsInfo
                                            |> Dict.insert lotId (Success measurement)
                                }
                            , Cmd.none
                            )

                        Err _ ->
                            ( LotsLoaded
                                { d
                                    | latestLotsInfo =
                                        d.latestLotsInfo
                                            |> Dict.insert lotId Failure
                                }
                            , Cmd.none
                            )

                _ ->
                    ( LotsLoadingFailure, Cmd.none )


viewLot : LotDto -> Promise LotMeasurementDto -> Html Msg
viewLot lot li =
    div [ class "flex flex-col items-center border-2 p-2" ]
        [ p [ class "text-center text-4xl font-bold" ] [ text lot.lotId ]
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
view model =
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

subscriptions : Model -> Sub Msg
subscriptions _ =
    Time.every 5000 Tick


main : Program () Model Msg
main =
    Browser.element
        { init = \_ -> init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }
