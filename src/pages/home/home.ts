import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { UbicacionProvider } from "../../providers/ubicacion/ubicacion";
import { LoginPage } from "../login/login";
import { UsuarioProvider } from "../../providers/usuario/usuario";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  // lat: number;
  // lng: number;
  user: any = {};
  constructor(
    public navCtrl: NavController,
    public ubicacionProv: UbicacionProvider,
    public usuarioProv: UsuarioProvider
  ) {
    this.ubicacionProv.iniciarGeolocalizacion();
    this.ubicacionProv.inicializarTaxista();
    this.ubicacionProv.taxista.valueChanges().subscribe(data => {
      //esa data es la data de firebase
      console.log("home data del database sin y con stringifear");
      console.log(data);
      console.log(JSON.stringify(data));

      this.user = data;
    });
  }

  salir() {
    this.ubicacionProv.detenerUbicacion();
    this.navCtrl.setRoot(LoginPage);
    this.usuarioProv.borrarUsuario();
  }
}
