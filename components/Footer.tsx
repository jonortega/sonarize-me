"use client";

import Link from "next/link";
import { Github, Linkedin } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";

export default function Footer() {
  return (
    <footer className='bg-spotify-black text-spotify-gray-100 py-6 border-t border-spotify-gray-200'>
      <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col md:flex-row justify-between items-center'>
          <div className='mb-4 md:mb-0'>
            <p className='text-sm'>sonarize.me (2025)</p>
          </div>
          <div className='flex space-x-4'>
            <Link
              href='https://github.com/jonortega'
              aria-label='GitHub'
              className='text-white hover:text-spotify-green'
            >
              <Github size={24} />
            </Link>
            <Link
              href='https://www.linkedin.com/in/jon-ortega-g/'
              aria-label='LinkedIn'
              className='text-white hover:text-spotify-green'
            >
              <Linkedin size={24} />
            </Link>
          </div>
        </div>
        <div className='mt-4 text-center text-xs'>
          {/* <Link href='#' className='hover:text-spotify-green mr-4'>
            About
          </Link> */}

          {/* Modal para la política de privacidad */}
          <Dialog>
            <DialogTrigger asChild>
              <button className='text-sm hover:text-spotify-green mr-4'>Política de Privacidad</button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className='text-2xl font-bold text-spotify-green'>Política de Privacidad</DialogTitle>
              </DialogHeader>
              <div className='text-sm leading-relaxed text-spotify-gray-100 space-y-4'>
                <p>
                  En nuestra aplicación, el acceso y uso de datos personales de tu cuenta de Spotify se realiza de
                  manera transparente y conforme a las normativas aplicables. Al utilizar esta aplicación, aceptas los
                  siguientes puntos:
                </p>
                <ul className='list-disc list-inside space-y-2'>
                  <li>
                    <strong>Datos recopilados y uso:</strong> Solo solicitamos y utilizamos los datos necesarios para
                    proporcionar las funcionalidades de la aplicación, como tus canciones, artistas y géneros más
                    escuchados.
                  </li>
                  <li>
                    <strong>Almacenamiento de datos:</strong> Los datos obtenidos a través de la API de Spotify no se
                    almacenan de manera permanente. Se procesan únicamente durante tu sesión activa para garantizar que
                    siempre mostramos información actualizada.
                  </li>
                  <li>
                    <strong>Desconexión y eliminación de datos:</strong> Puedes desconectar tu cuenta de Spotify en
                    cualquier momento con el botón de logout de tu panel de usuario. Una vez desconectada, se eliminan
                    todos tus datos de nuestra aplicación.
                  </li>
                  <li>
                    <strong>Seguridad:</strong> Implementamos medidas de seguridad estándar en la industria para
                    proteger tus datos personales durante su procesamiento.
                  </li>
                  <li>
                    <strong>Autorización y consentimiento:</strong> Utilizamos el sistema de autorización OAuth 2.0 de
                    Spotify para garantizar que tienes control total sobre los permisos otorgados a esta aplicación.
                    Solo accederemos a los datos específicos que autorices.
                  </li>
                </ul>
                <p>
                  Para cualquier consulta o solicitud relacionada con tus datos personales, puedes contactarnos a través
                  de los links proporcionado en esta página.
                </p>
              </div>
              <div className='mt-6 text-right'>
                {/* Botón para cerrar el modal */}
                <DialogPrimitive.Close asChild>
                  <button className='px-4 py-2 bg-spotify-gray-100 text-black font-semibold rounded-lg hover:bg-spotify-green/90'>
                    Cerrar
                  </button>
                </DialogPrimitive.Close>
              </div>
            </DialogContent>
          </Dialog>

          {/* <Link href='#' className='hover:text-spotify-green'>
            Contact
          </Link> */}
        </div>
      </div>
    </footer>
  );
}
