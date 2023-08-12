export default class Game extends Phaser.Scene {
  constructor() {

    super("game");
  }

  init() {
    this.puntos = 0;
    this.choques = 0;
    this.nivel = 1;
  }

  preload() {
    this.load.image("pelota", "assets/images/pelota.png");
    this.load.image("jugador", "assets/images/jugador.png");
    this.load.image("obstaculo", "assets/images/obstaculo.png");
  }

  create() {
    
    this.color = Phaser.Display.Color.RandomRGB().color;
 
    this.cameras.main.setBackgroundColor(this.color);

    this.pelota = this.physics.add
      .image(400, 100, "pelota")
      .setVelocity(100, 200)
      .setBounce(1, 1)
      .setScale(0.07)
      .setCollideWorldBounds(true);

    this.jugador = this.physics.add
      .image(400, 550, "jugador")
      .setScale(0.3)
      .setCollideWorldBounds(true);

    this.physics.add.collider(
      this.jugador,
      this.pelota,
      this.sumarPuntos,
      null,
      this
    );

    this.teclas = this.input.keyboard.createCursorKeys();

    this.nivelTexto = this.add.text(15, 15, "Nivel " + this.nivel, {
      fontSize: "15px",
      fill: "#FFFFFF",
    });

    this.cantidadPuntosTexto = this.add.text(15, 30, "Puntos:" + this.puntos, {
      fontSize: "15px",
      fill: "#FFFFFF",
    });
  }

  update() {
    if (this.teclas.left.isDown) {
      this.jugador.setVelocityX(-300);
    } else if (this.teclas.right.isDown) {
      this.jugador.setVelocityX(300);
    } else {
      this.jugador.setVelocityX(0);
    }
  }

  sumarPuntos() {
    this.puntos++;
    this.choques++;

    // console.log("Puntos:" + this.puntos)
    this.cantidadPuntosTexto.setText("Puntos:" + this.puntos);

    if (this.choques >= 3) {
      this.pasarNivel();
    }
  }

  pasarNivel() {
    this.choques = 0;
    this.nivel++;

    this.nivelTexto.setText("Nivel " + this.nivel);

    this.agregarObstaculo();
  }

  agregarObstaculo() {
    const obstaculoX = Phaser.Math.Between(50, 750); 
    const obstaculoY = Phaser.Math.Between(200, 400); 
    const ancho = Phaser.Math.Between(20, 70); 
    const alto = 25; 

    this.obstaculos = this.physics.add.staticGroup();

    this.obstaculos
      .create(obstaculoX, obstaculoY, "obstaculo")
      .setDisplaySize(ancho, alto)
      .setSize(ancho, alto)
      .refreshBody();

    this.physics.add.collider(this.pelota, this.obstaculos);
  }
}
