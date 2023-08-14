export default class Game extends Phaser.Scene {
  constructor() {
    super("game");
  }

  init() {
    this.puntos = 0;
    this.choques = 0;
    this.nivel = 1;
    this.vidas = 5;
    this.toqueBorde = false;
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
      .setVelocity(25, 50)
      .setBounce(1, 1)
      .setScale(0.07)
      .setCollideWorldBounds(true);

    this.jugador = this.physics.add
      .image(400, 550, "jugador")
      .setScale(0.3)
      .setImmovable()
      .setCollideWorldBounds(true);
    this.jugador.body.allowGravity = false;

    this.physics.add.collider(
      this.jugador,
      this.pelota,
      this.sumarPuntos,
      null,
      this
    );

    this.teclas = this.input.keyboard.createCursorKeys();

    this.nivelTexto = this.add.text(700, 15, "Nivel " + this.nivel, {
      fontSize: "20px",
    });

    this.cantidadPuntosTexto = this.add.text(15, 15, "Puntos: " + this.puntos, {
      fontSize: "20px",
      fill: "#FFFFFF",
    });

    this.cantidadVidasTexto = this.add.text(15, 40, "Vidas: " + this.vidas, {
      fontSize: "20px",
      fill: "#FFFFFF",
    });
  }

  update() {
    if (this.teclas.left.isDown) {
      this.jugador.setVelocityX(-400);
    } else if (this.teclas.right.isDown) {
      this.jugador.setVelocityX(400);
    } else {
      this.jugador.setVelocityX(0);
    }

    if (this.pelota.y > 550 && !this.toqueBorde) {
      this.perderVida();
    }

    if (this.pelota.y <= 550) {
      this.toqueBorde = false;
    }

    if (this.nivel == 20) {
      this.ganarJuego();

      this.scene.pause("game");
    }

    if (this.vidas == 0) {
      this.perderJuego();

      this.scene.pause("game");
    }
  }

  sumarPuntos() {
    this.puntos++;
    this.choques++;

    // console.log("Puntos:" + this.puntos)
    this.cantidadPuntosTexto.setText("Puntos: " + this.puntos);

    if (this.choques >= 3) {
      this.pasarNivel();
    }
  }

  perderVida() {
    this.toqueBorde = true;
    this.vidas--;
    this.cantidadVidasTexto.setText("Vidas: " + this.vidas);
  }

  pasarNivel() {
    this.choques = 0;
    this.nivel++;

    this.nivelTexto.setText("Nivel " + this.nivel);

    this.color = Phaser.Display.Color.RandomRGB().color;
    this.cameras.main.setBackgroundColor(this.color);

    this.agregarObstaculo();

    this.pelota.setVelocityX(this.pelota.body.velocity.x * 1.1);
    this.pelota.setVelocityY(this.pelota.body.velocity.y * 1.1);
  }

  agregarObstaculo() {
    const obstaculoX = Phaser.Math.Between(50, 750);
    const obstaculoY = Phaser.Math.Between(150, 400);
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

  ganarJuego() {
    this.cantidadPuntosTexto = this.add.text(235, 200, "¡GANASTE!", {
      fontSize: "60px",
      fill: "#FFFFFF",
    });
  }

  perderJuego() {
    this.cantidadPuntosTexto = this.add.text(235, 200, "PERDISTE :(", {
      fontSize: "60px",
      fill: "#FFFFFF",
    });
  }
}
