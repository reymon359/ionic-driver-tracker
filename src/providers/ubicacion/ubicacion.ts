import { Injectable } from "@angular/core";
import { Geolocation } from "@ionic-native/geolocation";
import {
  AngularFirestore,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import { UsuarioProvider } from "../usuario/usuario";
import { Subscription } from "rxjs";
@Injectable()
export class UbicacionProvider {
  taxista: AngularFirestoreDocument<any>; //en los <> digo que tipo de info va a tener
  private watch: Subscription; //esto va a ser un observador para dejar de observar al salir de la app
  constructor(
    private afDB: AngularFirestore,
    private geolocation: Geolocation,
    public usuarioProv: UsuarioProvider
  ) {
    //en el constructor tengo que hacer una referencia de que el taxista apunte al usuario de firebase
    // this.taxista = afDB.doc(`/usuarios/${usuarioProv.clave}`);
  }
  inicializarTaxista() {
    console.log("entra en iniciar taxista");

    this.taxista = this.afDB.doc(`/usuarios/${this.usuarioProv.clave}`);
  }
  iniciarGeolocalizacion() {
    console.log("entra en iniciar geolocalizacion");
      this.geolocation
        .getCurrentPosition()
        .then(resp => {
          console.log(
            "ubi.ts data del getcurrentposition sin y con stringifear"
          );
          console.log(resp);
          console.log(JSON.stringify(resp));
          // resp.coords.latitude
          // resp.coords.longitude
          // aqui es donde actualizamos el taxista en la base de datos de firebase. si el objeto no
          // tuviera la propiedad que queremos actualizar se añadiria
          this.taxista.update({
            lat: resp.coords.latitude,
            lng: resp.coords.longitude,
            clave: this.usuarioProv.clave
          }); 
          this.watch = this.geolocation.watchPosition().subscribe(data => {
            // data can be a set of coordinates, or an error (if an error occurred).
            // data.coords.latitude
            // data.coords.longitude
            this.taxista.update({
              lat: data.coords.latitude,
              lng: data.coords.longitude,
              clave: this.usuarioProv.clave
            });

            console.log(this.taxista);
          });
        })
        .catch(error => {
          console.log("Error getting location", error);
        });
 
  }
  detenerUbicacion() {
    try {
      this.watch.unsubscribe();
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  }
}
