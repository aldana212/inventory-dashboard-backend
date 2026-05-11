export const temporaryPasswordTemplate = (email, password) => {
  return `
  <div style="font-family: Arial, sans-serif; background:#f9fafb; padding:24px;">
    
    <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:10px; overflow:hidden; border:1px solid #e5e7eb;">
      
      <div style="background:#111827; padding:16px 24px;">
        <h2 style="color:#ffffff; margin:0; font-size:18px;">
          Acceso a tu cuenta
        </h2>
      </div>

      <div style="padding:24px;">
        
        <p style="font-size:14px; color:#374151;">
          Hola, tu cuenta ha sido creada correctamente en el sistema.
        </p>

        <div style="margin:16px 0; padding:16px; background:#f3f4f6; border-radius:8px;">
          <p style="margin:0; font-size:14px;">
            <b>Usuario:</b> ${email}
          </p>
          <p style="margin:8px 0 0; font-size:14px;">
            <b>Contraseña temporal:</b> 
            <span style="font-family:monospace; background:#e5e7eb; padding:4px 6px; border-radius:4px;">
              ${password}
            </span>
          </p>
        </div>

        <p style="font-size:13px; color:#6b7280;">
          Por seguridad, esta contraseña es temporal y debe ser cambiada inmediatamente después de iniciar sesión.
        </p>

        <div style="margin-top:20px; padding:12px; background:#fef2f2; border-left:4px solid #ef4444; border-radius:6px;">
          <p style="margin:0; font-size:13px; color:#991b1b;">
            ⚠️ No compartas esta contraseña con nadie.
          </p>
        </div>

        <p style="margin-top:24px; font-size:12px; color:#9ca3af;">
          Si tú no solicitaste este acceso, ignora este mensaje o contacta al administrador del sistema.
        </p>

      </div>

      <div style="background:#f9fafb; padding:12px 24px; text-align:center; font-size:11px; color:#9ca3af;">
        © ${new Date().getFullYear()} Sistema Interno. Todos los derechos reservados.
      </div>

    </div>
  </div>
  `;
};