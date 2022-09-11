import nodemailer from 'nodemailer';

//copiar integracion desde Mailtrap y convertir los credenciales a variables de entorno
const emailOlvidePassword = async (datos)=>{
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
        subject: 'Reestablece tu Password',
        text: 'Reestablece tu Password', /* el texto sin HTML */
        html: `
                <p>Hola ${nombre}, has solicidato reestablecer tu password en APV.</>
                
                <p>Sigue el siguiente enlace para generar un nuevo password:
                <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a> </p>    

                <p>Si tú no creaste esta cuenta, puedes ignorar este mensaje</p>
              ` /* usamos la URL del frontend y no la del backend porque es React que debe comunicarse con el backend, no el usuario. El usuario solo debe lidiar con rutas del frontend que especificamos en React */
      })

      console.log("mensaje enviado: %s", info.messageId)
}

export default emailOlvidePassword;