Arena = function(game) //on créée notre objet Arena qui prend l'objet game en argument
{
    // VARIABLES UTILES
    this.game = game;
    var scene = game.scene;

    // LUMIERES
    //Lumière hémisphérique blanche en hauteur
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 0, -1100), scene);
    light.diffuse = new BABYLON.Color3(1, 1, 1);
    light.specular = new BABYLON.Color3(1, 1, 1);

    //Lumière ponctuelle rouge-orangée
    var light2 = new BABYLON.PointLight("Omni1", new BABYLON.Vector3(-1, 50, 170), scene);
    light2.diffuse = new BABYLON.Color3(0.6, 0.3, 0.26);
    /*TODO :  -3 lumières différentes
              -couleurs et intensités
    */

    // MATERIAUX ET TEXTURES
    var groundMat = new BABYLON.StandardMaterial("groundMat", scene);
    groundMat.diffuseTexture = new BABYLON.Texture("assets/images/pavewalk.jpg", scene);
    groundMat.diffuseTexture.uScale = 1.2;
    groundMat.diffuseTexture.vScale = 5.0;
    groundMat.specularColor = new BABYLON.Color3(0,0,0);

    var colMat = new BABYLON.StandardMaterial("colMat", scene);
    colMat.diffuseTexture = new BABYLON.Texture("assets/images/concrete.jpg", scene);
    colMat.diffuseTexture.uScale = 1.0;
    colMat.diffuseTexture.vScale = 10.0;
    colMat.specularColor = new BABYLON.Color3(0,0,0);

    var sphereMat = new BABYLON.StandardMaterial("sphereMat", scene);
    sphereMat.diffuseTexture = new BABYLON.VideoTexture("video", "assets/images/seulaubureau.mp4", scene, true);
    sphereMat.emissiveColor = new BABYLON.Color3(1,1,1);
    /*TODO :    -materiau standard
                -multi-materiaux
                -video-texture
                -normal map
                -texture procedurale (feu, nuage...)
    */

    //MESHS ET COLLISIONS

    for(var i = 0; i < 10; i++)
    {
      var cylinder1 = BABYLON.Mesh.CreateCylinder("cyl1", 100, 5, 5, 10, 10, scene);
      cylinder1.position = new BABYLON.Vector3(-15,50, 20*i);
      cylinder1.material = colMat;

      var cylinder2 = BABYLON.Mesh.CreateCylinder("cyl2", 100, 5, 5, 10, 10, scene);
      cylinder2.position = new BABYLON.Vector3(15,50,20*i);
      cylinder2.material = colMat;

    }

    var sphere = BABYLON.Mesh.CreateSphere("sphere", 10, 5, scene);
    sphere.rotation.z = Math.PI;
    sphere.rotation.y = Math.PI;
    sphere.position = new BABYLON.Vector3(-1, 10, 20);
    sphere.material = sphereMat;

    var ground = BABYLON.Mesh.CreateGround("sol", 40, 250, 2, scene);
    ground.position.z = 60;
    ground.material = groundMat;
    ground.checkCollisions = true;


    //ASCENSEUR
      var platform = BABYLON.Mesh.CreateBox("plateform", 6, scene);
      platform.position = new BABYLON.Vector3(0,0,-70);
      platform.scaling.x = 5;
      platform.scaling.z = 5;
      platform.checkCollisions = true;




    this.game.scene.sphere = sphere;
    this.game.scene.platform = platform;

    var animationSphere = new BABYLON.Animation("translateZ", "position.z",
    30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    var keys = [];

      keys.push({
      frame: 0,
      value: 20
    });
    keys.push({
      frame: 120,
      value: 80
    });
    keys.push({
      frame: 240,
      value: 20
    });

    animationSphere.setKeys(keys);
    sphere.animations = [];
    sphere.animations.push(animationSphere);
    scene.beginAnimation(sphere, 0, 240, true);


    //PLATFORM : UNE SORTE D'ASCENSEUR
    var animationPlatform = new BABYLON.Animation("translateY", "position.y",
    30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    var keys2 = [];

      keys2.push({
      frame: 0,
      value: -5
    });
    keys2.push({
      frame: 120,
      value: 40
    });
    keys2.push({
      frame: 240,
      value: -5
    });

    animationPlatform.setKeys(keys2);
    platform.animations = [];
    platform.animations.push(animationPlatform);
    scene.beginAnimation(platform, 0, 240, true);

    //AUDIO

    /*TODO : -sons d'ambiance
              -sons liés à des objets --> le son doit être localisé spatialement
    */

    //SKYBOX
    var sMaterial = new BABYLON.StandardMaterial("skyboxMaterial", scene);
    	 sMaterial.backFaceCulling = false;
       sMaterial.specularColor = new BABYLON.Color3(0,0,0);
       sMaterial.diffuseColor = new BABYLON.Color3(0,0,0);
    	 sMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/images/jaspercoast/jaspercoast", scene);
    	 sMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

    	 // Création d'un cube avec la material adaptée
    	 var skybox = BABYLON.Mesh.CreateBox("skybox", 1000, scene);
    	 skybox.material = sMaterial;

    /*TODO : -Créer une (grande) box
             -Un materiau avec une CubeTexture, attention à bien faire correspodre les faces.
    */
};

Arena.prototype={

    //ANIMATION
    _animateWorld : function(ratioFps)
    {

    }

}
