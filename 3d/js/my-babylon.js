/**
 * Created by Li Li on 2018-07-25.
 */
(function($) {
	this.myApp = this.myApp || {};

	var ns = this.myApp;

	ns.debugState = true;

	ns.debug = function () {
		if (ns.debugState) {
			for (var i = 0; i < arguments.length; i++) {
				console.log(arguments[i]);
			}
		}
	}

	var canvas = document.getElementById("renderCanvas"); // Get the canvas element
	var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

	/******* Add the create scene function ******/
	var createScene = function () {

		// Create the scene space
		var scene = new BABYLON.Scene(engine);

		// Add a camera to the scene and attach it to the canvas
		var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, BABYLON.Vector3.Zero(), scene);
		camera.attachControl(canvas, true);

		// Add lights to the scene
		var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
		var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

		// Add and manipulate meshes in the scene
		var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2}, scene);

		return scene;
	};

	/******* End of the create scene function ******/

	var scene = createScene(); //Call the createScene function

	engine.runRenderLoop(function () { // Register a render loop to repeatedly render the scene
		scene.render();
	});

	var canvas2 = document.getElementById("renderCanvas2");
	var engine2 = new BABYLON.Engine(canvas2, true);
	var createScene2 = function (engine, canvas) {
		var scene = new BABYLON.Scene(engine);

		//Adding a light
		var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(20, 20, 100), scene);

		//Adding an Arc Rotate Camera
		var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 100, BABYLON.Vector3.Zero(), scene);
		camera.attachControl(canvas, false);

		var assetsManager = new BABYLON.AssetsManager(scene);
		var meshTask = assetsManager.addMeshTask("skull task", "", "scenes/", "skull.babylon");

		meshTask.onSuccess = function (task) {
			task.loadedMeshes[0].position = BABYLON.Vector3.Zero();
		}

		// Move the light with the camera
		scene.registerBeforeRender(function () {
			light.position = camera.position;
		});

		assetsManager.onFinish = function (tasks) {
			engine.runRenderLoop(function () {
				scene.render();
			});
		};

		assetsManager.load();

		return scene;
	}
	var scene2 = createScene2(engine2,canvas2);

	var canvas3 = document.getElementById("renderCanvas3");
	var engine3 = new BABYLON.Engine(canvas3, true);
	var createScene3 = function (engine, canvas) {
		var scene = new BABYLON.Scene(engine);

		//Adding a light
		var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(20, 20, 100), scene);

		//Adding an Arc Rotate Camera
		// Default camera is Universal Camera. Other camera types: https://doc.babylonjs.com/babylon101/cameras
		var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 500, BABYLON.Vector3.Zero(), scene);

		// https://doc.babylonjs.com/api/classes/babylon.arcrotatecamera#constructor
		// name:string, alpha:number, beta:number, radius:number, target:Vector3, scene:scene

		// camera.attachControl(canvas, noPreventDefault:bool, useCtrlForPanning:bool);
		camera.attachControl(canvas, false);


		var assetsManager = new BABYLON.AssetsManager(scene);
		var meshTask = assetsManager.addMeshTask("r2d2 task", "", "scenes/", "r2d2.babylon");

		meshTask.onSuccess = function (task) {
			task.loadedMeshes[0].position = BABYLON.Vector3.Zero();
		}

		// Move the light with the camera
		scene.registerBeforeRender(function () {
			light.position = camera.position;
		});

		assetsManager.onFinish = function (tasks) {
			engine.runRenderLoop(function () {
				scene.render();
			});
		};

		assetsManager.load();

		return scene;
	}
	var scene3 = createScene3(engine3,canvas3);

	window.addEventListener("resize", function () { // Watch for browser/canvas resize events
		engine.resize();
		engine2.resize();
		engine3.resize();
	});

	ns.changeColor = function() {
		// for scene3
		var mesh = scene3.getMeshByID('Box001');
		//mesh.material = mesh.material.clone();
		var color = JSON.parse(this.getAttribute('data-color'));
		color = new BABYLON.Color3(color[0],color[1],color[2]); // e.g. (1,1,0) = rgb(255,255,0)
		ns.debug('Before color change',mesh.material.diffuseColor);
		mesh.material.diffuseColor = color;
		ns.debug('After color change',mesh.material.diffuseColor);
	}

	ns.drawText = function() {
		// for scene3

		var myTexture = new BABYLON.DynamicTexture("dynamic texture", {width:250, height:250}, scene3);

		var text = this.getAttribute('data-text');
		var font = "bold 24px Arial";
		// https://doc.babylonjs.com/api/classes/babylon.dynamictexture#drawtext
		// drawText(text: string, x: number, y: number, font: string, color: string, clearColor: string, invertY?: boolean, update?: boolean)
		myTexture.hasAlpha = true;
		//myTexture.drawText(text, 35, 75, font, "#f44242", null, true, true);
		//myTexture.drawText(text, 35, 75, font, "#f44242", 'transparent', true, true);
		myTexture.drawText(text, 35, 75, font, "#f44242", '#1C95B1', true, true);

		var myMaterial = new BABYLON.StandardMaterial("MatDynamicText", scene3);
		myMaterial.diffuseTexture = myTexture;
		myMaterial.zOffset = -2;

		var mesh = scene3.getMeshByID('Box001');
	//	mesh.material = myMaterial;
		console.log(mesh.material);
		//var oldMaterial = mesh.material.clone();
		//var newDecal = BABYLON.Mesh.CreateDecal("decal dynamic texture", mesh, new BABYLON.Vector3(0, 100, 0), new BABYLON.Vector3(0, 120, 0), new BABYLON.Vector3(10, 10, 10));
		//var decal = BABYLON.MeshBuilder.CreateDecal("decal", cat, {position: pickInfo.pickedPoint, normal: pickInfo.getNormal(true), size: decalSize});
		//newDecal.material = myMaterial;

		mesh.material.diffuseTexture = myTexture;
		//mesh.material.opacityTexture = myTexture;
		mesh.material.emissiveTexture = myTexture;
		//mesh.useAlphaFromDiffuseTexture = true;
		//mesh.material.disableLighting = true;
		//mesh.material.diffuseColor = new BABYLON.Color3(1,1,0);
		console.log(mesh.material);


	}

	var classChangeColor = document.getElementsByClassName('lili-change-color');
	for (var i = 0; i < classChangeColor.length; i++) {
		classChangeColor[i].addEventListener('click', ns.changeColor, false);
	}

	var classDrawText = document.getElementsByClassName('lili-draw-text');
	for (var i = 0; i < classDrawText.length; i++) {
		classDrawText[i].addEventListener('click', ns.drawText, false);
	}

}());