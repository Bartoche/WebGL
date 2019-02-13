Player = function(game, canvas)
{
  // _this est l'accès à la caméra à l'interieur de Player
  var _this = this;

  // Le jeu, chargé dans l'objet Player
  this.game = game;

  //On définit la vitesse de notre personnage
  this.speed = 1;

  // Sensibilité angulaire
  _this.angularSensibility = 200;

  /* à décommenter si vous êtes dans Weapon.js
  // Si le tir est activé ou non
  this.weaponShoot = false;
  */

  /*
  //AXES DE DEPLACEMENT ////////////////////////////////////////////////////////
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

    /*
  // Quand la souris bouge dans la scène
  window.addEventListener("mousemove" , function(evt)
  {
    if(_this.rotEngaged === true) //si notre souris est bien capturée dans notre scène
    {
      _this.camera.playerBox.rotation.y += evt.movementX * 0.001 * (_this.angularSensibility / 250);
      var nextRotationX = _this.camera.playerBox.rotation.x + (evt.movementY * 0.001 * (_this.angularSensibility / 250));
      if( nextRotationX < degToRad(90) && nextRotationX > degToRad(-90)){
          _this.camera.playerBox.rotation.x+=evt.movementY * 0.001 * (_this.angularSensibility / 250);
      }
    }
  }, false);*/


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

  //Si on appuie sur la touche saut et que le perso peut sauter, on définit la hauteur de son saut (sur l'axe y) et on l'empêche de pouvoir ressauter
  // La hauteur du personnage
  _this.originHeight = _this.camera.playerBox.position.clone();
  window.addEventListener("keydown", function(evt) {
      if(evt.keyCode === 32){
          if(_this.camera.canJump===true){
                  // On définit la hauteur de saut à la position actuelle du joueur
                  // plus la variable jumpHeight
                  _this.camera.jumpNeed = _this.camera.playerBox.position.y + _this.jumpHeight;
                  _this.camera.canJump=false;
              }
      }
  }, false);

};

Player.prototype = {

  _initCamera : function(scene, canvas) {

    // CAMERA ////////////////////////////////////////////////////////////////
    this.camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(10, 15, 150), scene);
    //this.camera.setPhysicsState({ impostor: BABYLON.PhysicsEngine.SphereImpostor, mass: 1 });

    // On demande à la caméra de regarder au point zéro de la scène
    this.camera.setTarget(BABYLON.Vector3.Zero());
    this.camera.attachControl(canvas, true);
    this.camera.applyGravity = true;
    this.camera.checkCollisions = true;
    this.camera.ellipsoid = new BABYLON.Vector3(1, 8, 1);

    // On initialise les axes de mouvement de la caméra à nul
    this.camera.axisMovement = [false,false,false,false];//dans l'ordre [haut,bas,gauche,droite]

    //PLAYERBOX ///////////////////////////////////////////////////////////////
    //On crée une box player Box qui va représenter notre joueur auquel on va attacher un ellipsoid qui va lui permettre de détecter les collisions (voir doc)
    var playerBox = BABYLON.Mesh.CreateSphere("headMainPlayer", 3, scene);
    playerBox.position = new BABYLON.Vector3(-20, 4, 10);
    playerBox.ellipsoid = new BABYLON.Vector3(1.1, 8, 1.1);
    //On associe playerBox à notre caméra
    this.camera.playerBox = playerBox;

    //On la parente à notre playerBox pour qu'elle suive ses déplacements
    this.camera.parent = this.camera.playerBox;

    // Ajout des collisions avec playerBox
    this.camera.playerBox.checkCollisions = true;

    this.isAlive = true;
    this.game.camera = this.camera;
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

    this.camera.keysUp = [90]; // Touche Z
    this.camera.keysDown = [83]; // Touche S
    this.camera.keysLeft = [81]; // Touche Q
    this.camera.keysRight = [68]; // Touche D;
    /*
    //DEPLACEMENTS ///////////////////////////////////////////////////////////
    if(this.camera.axisMovement[0]){
            forward = new BABYLON.Vector3(
                parseFloat(Math.sin(parseFloat(this.camera.playerBox.rotation.y))) * relativeSpeed,
                0,
                parseFloat(Math.cos(parseFloat(this.camera.playerBox.rotation.y))) * relativeSpeed
            );
            this.camera.playerBox.moveWithCollisions(forward);
        }
        if(this.camera.axisMovement[1]){
            backward = new BABYLON.Vector3(
                parseFloat(-Math.sin(parseFloat(this.camera.playerBox.rotation.y))) * relativeSpeed,
                0,
                parseFloat(-Math.cos(parseFloat(this.camera.playerBox.rotation.y))) * relativeSpeed
            );
            this.camera.playerBox.moveWithCollisions(backward);
        }
        if(this.camera.axisMovement[2]){
            left = new BABYLON.Vector3(
                parseFloat(Math.sin(parseFloat(this.camera.playerBox.rotation.y) + degToRad(-90))) * relativeSpeed,
                0,
                parseFloat(Math.cos(parseFloat(this.camera.playerBox.rotation.y) + degToRad(-90))) * relativeSpeed
            );
            this.camera.playerBox.moveWithCollisions(left);
        }
        if(this.camera.axisMovement[3]){
            right = new BABYLON.Vector3(
                parseFloat(-Math.sin(parseFloat(this.camera.playerBox.rotation.y) + degToRad(-90))) * relativeSpeed,
                0,
                parseFloat(-Math.cos(parseFloat(this.camera.playerBox.rotation.y) + degToRad(-90))) * relativeSpeed
            );
            this.camera.playerBox.moveWithCollisions(right);
        }*/

    // SAUT ///////////////////////////////////////////////////////////////////
    if(this.camera.jumpNeed) //on monte
    {
      percentMove = this.camera.jumpNeed - this.camera.playerBox.position.y;
      up = new BABYLON.Vector3(0,percentMove/4 *  relativeSpeed,0);
      this.camera.playerBox.moveWithCollisions(up);
      if(this.camera.playerBox.position.y + 1 > this.camera.jumpNeed)
      {
          // Si c'est le cas, on prépare airTime
          console.log('hauteur atteinte');
          this.camera.airTime = 0;
          this.camera.jumpNeed = false;
      }
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
      var targetHeight = 2.810;//trouver taille du joueur
      // Si la distance avec le sol est inférieure ou égale à la hauteur du joueur -> On a touché le sol
      if(distPlayer.distance <= targetHeight)
      {

          this.camera.canJump = true;

          //Si le sol est en train de monter...
          if(distPlayer.distance<2.81)
          {
              this.camera.playerBox.position.y = this.camera.playerBox.position.y + 2.81 - distPlayer.distance;
          }

          // On remet airTime à 0
          this.camera.airTime = 0;
          this.jump=0;
      }
      else
      {
          // Sinon, on augmente airTime
          this.camera.airTime++;
          //console.log(this.camera.airTime);
          // Et on déplace le joueur vers le bas, avec une valeur multipliée par airTime
          this.camera.playerBox.moveWithCollisions(new BABYLON.Vector3(0,(-this.camera.airTime/30) * relativeSpeed ,0));
      }
    }
  },

};
