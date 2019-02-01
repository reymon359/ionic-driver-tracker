import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Platform } from "ionic-angular";
import { Storage } from "@ionic/storage";
import { Subscription } from "rxjs";
@Injectable()
export class UsuarioProvider {
  clave: string;
  user: any = {};
  private doc:Subscription;
  constructor(
    private afDB: AngularFirestore,
    private platform: Platform,
    private storage: Storage
  ) {}
  verificaUsuario(clave: string) {
    // Ahora tengo que hacer referencia a nuestro documento con la clave en la base de datos,
    // cuando me escriban una clave comprueba si hay alguna como la que han escrito.
    clave = clave.toLocaleLowerCase(); //Lo paso a minusculas.
    return new Promise((resolve, reject) => {
      //Promesa porque puede tardar en conectarse y tal.

      this.doc = this.afDB.doc(`/usuarios/${clave}`) //Uso un template literal para hacer referencia al documento.
        .valueChanges().subscribe(data => {
          //Ahora me subscribo a él para detectar cambios.
          if (data) {
            //correcto
            this.clave = clave;
            this.user = data;
            this.guardarStorage();
            resolve(true);
          } else {
            //incorrecto
            resolve(false);
          }
        });
    });
  }
  guardarStorage() {
    if (this.platform.is("cordova")) {
      //celular
      this.storage.set("clave", this.clave);
    } else {
      //Escritorio
      localStorage.setItem("clave", this.clave);
    }
  }
  cargarStorage() {
    //vamos a hacerlo con promesa porque la lectura del dispoistivo puede tardar un poco
    return new Promise((resolve, reject) => {
      if (this.platform.is("cordova")) {
        //celular
        this.storage.get("clave").then(val => {
          //ahora vemos si existe valor. si no existe, ha devuelto null
          if (val) {
            this.clave = val;
            resolve(true);
          } else {
            resolve(false);
          }
        });
        this.storage.set("clave", this.clave);
      } else {
        //Escritorio
        if (localStorage.getItem("clave")) {
          this.clave = localStorage.getItem("clave");
          resolve(true);
        } else {
          resolve(false); //tambien se puede usar el reject
        }
      }
    });
  }
  borrarUsuario(){
    this.clave=null;
    if (this.platform.is('cordova')) {
      this.storage.remove('clave');
    } else {
      localStorage.removeItem('clave');
    }
    this.doc.unsubscribe();
  }
}
