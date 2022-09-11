import nodemailer from 'nodemailer';

//copiar integracion desde Mailtrap y convertir los credenciales a variables de entorno
const emailRegistro = async (datos)=>{
  //le cambie el nombre a la variable. de transport a transporte
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

    //   console.log(datos);

    const {email, nombre, token} = datos;

      //Enviar el Email
      const info = await transporter.sendMail({
        from: "APV - Administrador de Pacientes de Veterinaria",
        to: email,
        subject: 'Comprueba tu cuenta en APV',
        text: 'Comprueba tu cuenta en APV', /* el texto sin HTML */
        html: `
                <p>Hola ${nombre}, comprueba tu cuenta en APV.</>
                <p>Tu cuenta ya está lista, solo debes comprobarla en el siguiente enlace:
                <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta.</a> </p>    

                <p>Si tú no creaste esta cuenta, puedes ignorar este mensaje</p>
              ` /* usamos la URL del frontend y no la del backend porque es React que debe comunicarse con el backend, no el usuario. El usuario solo debe lidiar con rutas del frontend que especificamos en React */
      })

      console.log("mensaje enviado: %s", info.messageId)
}

export default emailRegistro;