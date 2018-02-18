import * as $ from "jquery";
import Greeter from "./entities/greeter";

let greeter = new Greeter("world!");
let msg = greeter.greet();
$("body").html(`<h1>UnSHACLed</h1><p>${msg}</p>`);
