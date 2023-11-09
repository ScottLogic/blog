const glob = require("glob-promise");
const fs = require("fs");

(async () => {
    let postPaths = await glob('./**/*.{md,markdown,html,yml,js}').then((paths) => {
        return paths;
    });

    const imagePaths = await glob('./**/*.{gif,png,jpg,jpeg}', {ignore:'./_site/**'}).then((paths) => {
        return paths;
    });

    for (const imagePath of imagePaths) {
        const image = imagePath.split("/").pop();

        var found = false;
        for (const postpath of postPaths) {
            const file = fs.readFileSync(postpath).toString();
            if(file.includes(image) || file.includes(encodeURI(image))){
                found = true;
                break;
            }
        }

        if(!found){
            fs.unlinkSync(imagePath);
        }
    }
})();