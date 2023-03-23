function getLeafFragIds( model, leafId ) {
    const instanceTree = model.getData().instanceTree;
    const fragIds = [];

    instanceTree.enumNodeFragments( leafId, function( fragId ) {
        fragIds.push( fragId );
    });

    return fragIds;
}

function getModifiedWorldBoundingBox( fragIds, fragList ) {

    const fragbBox = new THREE.Box3();
    const nodebBox = new THREE.Box3();

    fragIds.forEach( function( fragId ) {
        fragList.getWorldBounds( fragId, fragbBox );

        nodebBox.union( fragbBox );
    });
    
    return nodebBox;
}

function getComponentBoundingBox( model, dbId) {
    const fragIds = getLeafFragIds( model, dbId );
    const fragList = model.getFragmentList();

    return getModifiedWorldBoundingBox( fragIds, fragList );
}

function getMeshGeometry( data, vertexArray ) {

    const offsets = [{
        count: data.indices.length,
        index: 0,
        start: 0
    }];

    for( let oi = 0, ol = offsets.length; oi < ol; ++oi ) {

        let start = offsets[oi].start;
        let count = offsets[oi].count;
        let index = offsets[oi].index;
        for( let i = start, il = start + count; i < il; i += 3) {
            const a = index + data.indices[i];
            const b = index + data.indices[i + 1];
            const c = index + data.indices[i + 2];
            const vA = new THREE.Vector3();
            const vB = new THREE.Vector3();
            const vC = new THREE.Vector3();
            vA.fromArray( data.positions, a * data.stride );
            vB.fromArray( data.positions, b * data.stride );
            vC.fromArray( data.positions, c * data.stride );
            vertexArray.push( vA );
            vertexArray.push( vB );
            vertexArray.push( vC );
        }
    }
}


// Build THREE.Mesh
function buildComponentMesh( Mymodel, dbId ) {

    const geometry1 = getComponentGeometry( Mymodel, dbId );

    const boundingBox =getComponentBoundingBox( Mymodel, dbId );
    const matrixWorld = geometry1.matrixWorld;
    const nbMeshes = geometry1.meshes.length;

    const vertexArray = [];

    for( let idx=0; idx < nbMeshes; ++idx ) {
        const mesh = geometry1.meshes[idx];

        const meshData = {
            positions: mesh.positions,
            indices: mesh.indices,
            stride: mesh.stride
        };

        getMeshGeometry( meshData, vertexArray );
    }

    const geometry = new THREE.Geometry();

    for( let i = 0; i < vertexArray.length; i += 3 ) {

        geometry.vertices.push( vertexArray[i] );
        geometry.vertices.push( vertexArray[i + 1] );
        geometry.vertices.push( vertexArray[i + 2] );

        const face = new THREE.Face3( i, i + 1, i + 2 );

        geometry.faces.push( face );
    }

    const matrixWorld1 = new THREE.Matrix4();

    matrixWorld1.fromArray( matrixWorld );

    const mesh = new THREE.Mesh( geometry );

    mesh.applyMatrix( matrixWorld1 );

    mesh.boundingBox = boundingBox;

    mesh.dbId = dbId;

    return mesh;
}

// get geometry for all fragments in a component
function getComponentGeometry( Mymodel, dbId ) {
    const fragIds = getLeafFragIds( Mymodel, dbId );

    let matrixWorld = null;

    const meshes = fragIds.map( function( fragId ) {

        const renderProxy = NOP_VIEWER.impl.getRenderProxy( Mymodel, fragId );

        const geometry = renderProxy.geometry;
        const attributes = geometry.attributes;
        const positions = geometry.vb ? geometry.vb : attributes.position.array;

        const indices = attributes.index.array || geometry.ib;
        const stride = geometry.vb ? geometry.vbstride : 3;
        const offsets = geometry.offsets;

        matrixWorld = matrixWorld || renderProxy.matrixWorld.elements;

        return {
            positions,
            indices,
            offsets,
            stride
        };
    });
    return {
        matrixWorld,
        meshes
    };
}
