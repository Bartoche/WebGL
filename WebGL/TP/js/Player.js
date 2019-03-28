Player = function(game, canvas) //On définit l'objet Player dans lequel on va pouvoir faire appel à ses méthodes définies dans son prototype
//ainsi que des fonctions extérieures à Player
{
  // _this est l'accès à la caméra à l'interieur de Player
  var _this = this;

  // Le jeu, chargé dans l'objet Player
  this.game = game;

  //On définit la vitesse de notre personnage
  this.speed = 1;

  /* à décommenter si vous êtes dans Weapon.js
  // Si le tir est activé ou non
  this.weaponShoot = false;
  */
/*
  //Quand les touches de déplacement sont relachées, on met les axes de déplacement de la caméra à faux

  window.addEventListener("keyup", function(evt) {

      switch(evt.keyCode){
          case 90:
          _this.camera.axisMovement[0] = false;
          break;
          case 83:
          _this.camera.axisMovement[1] = false;
          break;
          case 81:
          _this.camera.axisMovement[2] = false;
          break;
          case 68:
          _this.camera.axisMovement[3] = false;
          break;
      }
  }, false);


  // Quand les touches sont appuyées, on met les axes à vrai
  window.addEventListener("keydown" , function(evt)
  {
    switch(evt.keyCode){
      case 90:
          _this.camera.axisMovement[0] = true;
          break;
      case 83:
          _this.camera.axisMovement[1] = true;
          break;
      case 81:
          _this.camera.axisMovement[2] = true;
          break;
      case 68:
          _this.camera.axisMovement[3] = true;
          break;
    }
  }, false);
*/

  // Quand la souris bouge dans la scène
  /*//à décommenter
  window.addEventListener(//TODO , function(evt)
  {
    if(_this.rotEngaged === true) //si notre souris est bien capturée dans notre scène
    {
      //TODO
    }
  }, false);
*/
  // On récupère le canvas de la scène
  var canvas = this.game.scene.getEngine().getRenderingCanvas();

  /* à décommenter si vous êtes dans Weapon.js
  // On affecte le clic et on vérifie qu'il est bien utilisé dans la scène (_this.controlEnabled)
  canvas.addEventListener("mousedown", function(evt) {
      if (_this.controlEnabled && !_this.weaponShoot) {
          _this.weaponShoot = true;
          _this.handleUserMouseDown();
      }
  }, false);

  // On fait pareil quand l'utilisateur relache le clic de la souris
  canvas.addEventListener("mouseup", function(evt) {
      if (_this.controlEnabled && _this.weaponShoot) {
          _this.weaponShoot = false;
          _this.handleUserMouseUp();
      }
  }, false);
  */

  // Initialisation de la caméra dans notre scène
  this._initCamera(this.game.scene, canvas);

  // Le joueur doit cliquer dans la scène pour que controlEnabled passe à vrai, et ainsi, que le curseur soit capturé
  this.controlEnabled = false;

  // On lance l'event _initPointerLock pour vérifier le clic dans la scène
  this._initPointerLock();

  // Si le joueur peut sauter ou non
  _this.camera.canJump = true;

  // La hauteur d'un saut
  _this.jumpHeight = 19.9; //+1 pt pour ceux qui devinent pourquoi (campagnes 2017)

  //La hauteur à atteindre( à définir quand on saute)
  _this.camera.jumpNeed = 0;

  //Si on appuie sur la touche saut et que le perso peut sauter, on définit la hauteur de son saut (sur l'axe y) et on l'empêche de pouvoir ressauter
  //TODO
};

Player.prototype = {

  _initCamera : function(scene, canvas)
  {
    // On crée la caméra
    this.camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(-3, 15, 150), scene);
    this.camera.applyGravity = true;
    this.camera.checkCollisions = true;


    // On demande à la caméra de regarder au point zéro de la scène
    this.camera.setTarget(BABYLON.Vector3.Zero());

    // On affecte le mouvement de la caméra au canvas //à supprimer quand vous vous y mettez
    this.camera.attachControl(canvas, true);//à supprimer quand vous vous y mettez

    this.camera.ellipsoid = new BABYLON.Vector3(1, 8, 1);


    // On initialise les axes de mouvement de la caméra à nul
    this.camera.axisMovement = [false,false,false,false];//dans l'ordre [haut,bas,gauche,droite]

    /* à décommenter si vous êtes dans Weapon.js
    // On crée les armes !
    this.camera.weapons = new Weapons(this);
    */

    //On crée une box player Box qui va représenter notre joueur auquel on va attacher un ellipsoid qui va lui permettre de détecter les collisions (voir doc)

    //On associe playerBox à notre caméra
    //this.camera.playerBox = playerBox; //à dé-commenter quand vous vous y mettez

    //On la parente à notre playerBox pour qu'elle suive ses déplacements
    /*TODO*/

    // Ajout des collisions avec playerBox
    /*TODO*/
  },


  _initPointerLock : function()
  {
    var _this = this;

    // Requete pour la capture du pointeur
    var canvas = this.game.scene.getEngine().getRenderingCanvas();

    //
    canvas.addEventListener("click", function(evt)
    {
      canvas.requestPointerLock = canvas.requestPointerLock ||canvas.msRequestPointerLock || canvas.mozRequestPointerLock|| canvas.webkitRequestPointerLock;

      if (canvas.requestPointerLock)
      {
        canvas.requestPointerLock();
      }
    }, false);

    // Evenement pour changer le paramètre de rotation
    var pointerlockchange = function (event)
    {
      _this.controlEnabled = (document.mozPointerLockElement === canvas || document.webkitPointerLockElement === canvas || document.msPointerLockElement === canvas || document.pointerLockElement === canvas);
      if (!_this.controlEnabled)
      {
        _this.rotEngaged = false;
      }
      else
      {
        _this.rotEngaged = true;
      }
    };

    // Event pour changer l'état du pointeur, sous tout les types de navigateur
    document.addEventListener("pointerlockchange", pointerlockchange, false);
    document.addEventListener("mspointerlockchange", pointerlockchange, false);
    document.addEventListener("mozpointerlockchange", pointerlockchange, false);
    document.addEventListener("webkitpointerlockchange", pointerlockchange, false);
  },

  _checkMove : function(ratioFps)
  {
    //nous créons une vitesse relative qui va dépendre des performances de l'ordinateur pour ne pas altérer le gameplay en fonction de la machine
    var relativeSpeed = this.speed / ratioFps;

    //TODO : Déplacer notre personnage sur les 4 axes
    this.camera.keysUp = [90]; // Touche Z
    this.camera.keysDown = [83]; // Touche S
    this.camera.keysLeft = [81]; // Touche Q
    this.camera.keysRight = [68]; // Touche D;
    this.camera.jumpNeed = [32];

    if(this.camera.jumpNeed) //on monte
    {

    }


    else //on descend
    {
      // On trace un rayon depuis le joueur
      var rayPlayer = new BABYLON.Ray(this.camera.playerBox.position,new BABYLON.Vector3(0,-1,0));

      // On regarde quel est le premier objet qu'on touche en excluant le mesh qui appartient au joueur
      var distPlayer = this.game.scene.pickWithRay(rayPlayer, function (item)
      {
        if (item.id == "headMainPlayer")
        {
          return false;
        }
        else
        {
          return true;
        }
      });

      // targetHeight est égal à la hauteur du personnage
      //TODO

      // Si la distance avec le sol est inférieure ou égale à la hauteur du joueur -> On a touché le sol
      //Du coup, le joueur peut de nouveau sauter, l'acceleration et la hauteur de saut sont réinitialisés
      //Sinon, l'acceleration augmente et on déplace le joueur vers le bas, avec l'acceleration multipliée par la vitesse relative
      //et divisée par un multiple de 10 (à juger)

      //TODO
    }
  },

  /*à décommenter si vous êtes dans Weapon.js
  handleUserMouseDown : function()
  {
    this.camera.weapons.fire();
  },
  handleUserMouseUp : function()
  {
    this.camera.weapons.stopFire();
  },
  */
};
