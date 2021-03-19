const rootDiv = document.getElementById('root')
const cameras = {};
function buildCamera (cameraName) {
    const cameraImageId = `camera-image-${cameraName}`;
    let cameraDom = cameras[cameraImageId];
    if (!cameraDom) {
        const wapperDivId =  `camera-wapper-${cameraName}`;
        const wapperNameId =  `camera-wapper-name-${cameraName}`;
        const wapper = document.createElement('div');
        wapper.className="camera-wapper";
        wapper.id = wapperDivId;

        const nameDiv = document.createElement('div');
        nameDiv.className="camera-wapper-name";
        nameDiv.innerHTML = cameraName;
        nameDiv.id = wapperNameId;

        const image = new Image();
        image.className="camera-wapper-image";
        image.src="https://publicdomainarchive.com/wp-content/uploads/2014/03/public-domain-images-free-stock-photos-chicago-skyline-night-1000x665.jpg"
        image.id = cameraImageId;
        wapper.appendChild(image);
        wapper.appendChild(nameDiv);
        rootDiv.appendChild(wapper);
        cameras[cameraImageId] = image;
        return image;
    }
    return cameraDom;
}
document.addEventListener('DOMContentLoaded',() => {
    const ws = new WebSocket('ws://localhost:3000/ws');
    
    ws.onopen = function() {
        ws.send(JSON.stringify({action: "cameraList"}));
    }
    ws.onmessage = (message) => {
        console.log('REC <<<',message.data, typeof message.data)
        const msg = message.data;
        try {
            const data  = JSON.parse(msg);
            if (data.action) {
                if (data.action === "cameraList") {
                    for (const cameraName of data.data) {
                        buildCamera(cameraName);
                    }
                }else if (data.action === 'image') {
                    const {cameraName,link} = data.data
                    const node = buildCamera(cameraName);
                    node.src = link;
                }
            }
        } catch (error) {
            console.error('onmessage [%s]->',msg ,error)
        }
    }
})