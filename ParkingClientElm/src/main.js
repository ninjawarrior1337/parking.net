import {Elm} from "./Parking.elm"

Elm.Parking.init({
    node: document.getElementById('app'),
    flags: {
        api_base: import.meta.env.VITE_API_BASE
    }
})