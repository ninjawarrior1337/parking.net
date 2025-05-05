module Lots exposing (Lot, LotMeasurement, listParkingDecoder, parkingInfoDecoder, parkingLatestDecoder)

import Json.Decode exposing (Decoder, field, int, list, map2, string, map3)


type alias Lot =
    { lotId : String
    , lotName: String
    , spacesCount : Int
    }


type alias LotMeasurement =
    { timestamp : String
    , availableSpaces : Int
    }


parkingInfoDecoder : Decoder Lot
parkingInfoDecoder =
    map3 Lot
        (field "lotId" string)
        (field "lotName" string)
        (field "spacesCount" int)


parkingLatestDecoder : Decoder LotMeasurement
parkingLatestDecoder =
    map2 LotMeasurement
        (field "timestamp" string)
        (field "availableSpaces" int)


listParkingDecoder : Decoder (List Lot)
listParkingDecoder =
    list parkingInfoDecoder
