module Main exposing (..)

import Browser
import Html exposing (..)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick)
import Parking


type alias Model =
    Int


type Msg
    = Increment
    | Decrement


update : Msg -> Model -> ( Model, Cmd msg )
update msg model =
    case msg of
        Increment ->
            ( model + 1, Cmd.none )

        Decrement ->
            ( model - 1, Cmd.none )


view : Model -> Browser.Document Msg
view model =
    { title = "Latest Lots"
    , body =
        [ div [ class "m-4" ]
            [ button [ onClick Decrement, class "bg-blue-400 p-2 rounded" ] [ text "-" ]
            , div [] [ text (String.fromInt model) ]
            , button [ onClick Increment ] [ text "+" ]
            ]
        ]
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( 0, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


main : Program () Model Msg
main =
    Browser.document
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }
