![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)

# Shipping — Eventia 

Deploy
------
URL: https://proyecto-c-shipping-eventia.vercel.app/
-----------------
Listado usuarios
------------------------------
- Usuario buyer: Email: buyer+clerk-test@iaw.com Contraseña: iawuser#
- Usuario seller: Email: seller+clerk-test@iaw.com Contraseña: iawuser#
- Administrador: admin+clerk-test@iaw.com Contraseña: iawuser#
  Este usuario podrá acceder a `/admin`.

-----------------
Necesario para evaluar la aplicación
------------------------------
- La forma de acceder a el modo de usuario admin es deslizando hasta el último bloque de la pagina de bienvenida, sellecionando "Administrador" en el apartado "Plataforma" 
-----------------
Descripción app
------------------------------
Shipping Eventia administra las entradas a los eventos. Genera las entradas y sus QR y permite escanearlos. 

Funcionalidades - Usuario Buyer
--------
- Panel Mis entradas: muestra las entradas de un usuario pudiendo filtrar por estado de la entrada y por fecha. Permite ver el detalle de la entrada seleccionada.

-----------------
Funcionalidades - Usuario Seller
--------
- Panel administrativo: muestra las entradas asociadas a ese vendedor con el ID del pedido y diferentes métricas.
- Escaneo QR: permite escanear QRs que pertenecen a los eventos que organizó, controlando los distintos estados que puede tener la entrada.

-----------------
Funcionalidades - Usuario Admin
--------
- Panel administrativo: muestra un panel completo con los ID de entrada, pedido, comprador y organizador.
- Simulación de APIS: permite simular un nuevo pedido, su confirmación y su cancelación.


-----------------
Notas
-------------------------
- En el panel "Mis entradas" de Buyer las entradas se juntan por pedido, es decir, si un usuario compra 3 entradas a un evento en un único pedido estas van a estar agrupadas en una sola en ésta sección, con el fin de facilitar el ingreso a un usuario. Luego, al momento de ver el detalle de la entrada se puede navegar entre las diferentes entradas, que todas tienen distinto ID y estado, pero pertenecen a un mismo usuario y a un mismo pedido. Por este motivo desde la vista general de "Mis entradas" no puede verse el estado; una entrada del pedido podría estar usada y otra no, entonces sería inconsistente mostrar el estado desde afuera. El filtro por estados tiene éste inconveniente, pero en el detalle se ven los estados correctamente.
- Al momento de escanear una entrada el estado no se actualiza instataneamente del lado del usuario Buyer, es necesario refrescar la página. Como la base de datos sí se actualiza, del lado del Seller es imposible escanear un mismo QR más de una vez, porque ya figura usado, así que es únicamente un inconveniente visual. 
