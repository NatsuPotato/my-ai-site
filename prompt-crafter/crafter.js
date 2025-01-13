// if (requestComments)
//     promptInfo.prompt += "/* Quality */\n";
// promptInfo.prompt += constructQualityPrompt(requestHighQuality) + ", ";

// if (artistsPrompt !== "") {

//     if (requestComments)
//         promptInfo.prompt += "\n\n/* Artists */\n";
    
//     promptInfo.prompt += artistsPrompt + ", ";
// }

// if (requestComments)
//     prompt += "\n\n/* Character/scene description */\n";
// prompt += description + ", ";

// maybe also provide a "getArtistsInfo" or something for initializing the crafter ui

function getPromptInfo(initPacket, promptPackets) {

    let promptInfo = {
        prompt: "",
        consideredBreasts: true, //shotPrompt !== "head shot" && !isMale,
        consideredBelly:   true, //shotPrompt !== "head shot",
        consideredHips:    true  //shotPrompt === "full body shot" || shotPrompt === "medium shot"
    };

    const comments = initPacket.format === "commented";

    if (initPacket.format === "aiyabot")
        promptInfo.prompt += "/draw prompt:";
    
    for (const packet of promptPackets) {

        if (comments)
            promptInfo.prompt += "/* " + packet.packetName.substring(0, 1).toUpperCase() + packet.packetName.substring(1) + " */\n";

        switch (packet.packetName) {

            case "description": promptInfo.prompt += packet.description + ", "; break;

            case "quality":     break;
                
            case "figure":      appendFigurePrompt(promptInfo, packet); break;
                
            case "artists":     break;
                
            case "composition": appendCompositionPrompt(promptInfo, packet); break;
                
            default:            console.log("Recieved unexpected packet: " + packet.packetName);
        }

        if (comments)
            promptInfo.prompt += "\n\n";
    }

    if (initPacket.format === "aiyabot") {

        if (initPacket.useNegatives)
            prompt += "bad anatomy, bad hands, text, missing finger, extra digits, fewer digits, mutated hands, mutated fingers, poorly drawn face, mutation, deformed face, ugly, bad proportions, bad anatomy, bad hands, text, error, missing fingers, cropped, censored, pixelart, ugly, sketch, lineart, monochrome, duplicate, morbid, mutilated, mutated, missing limbs, missing limb, monster, logo, print, cropped, (worst quality, low quality:1.4), extra fingers, fewer fingers, (bad eyes:1.2), (misfigured pupils:1.2), (bad clothing:1.3), (nonsensical backgrounds:1.2), (bad backgrounds:1.2), (bad shadows:1.2), (bad anatomy:1.1), jpeg artifacts, signature, watermark, username, blurry, out of frame, screenshot, game cg, user interface, source request, commentary request, english commentary, symbol-only commentary, commentary, commission, bad composition, inaccurate eyes, (extra arms:1.2)";
            // previous one: " negative_prompt:(ugly), ((watermark, hourglass)), ((mutilated)), out of frame, extra fingers, extra limbs, mutated hands, ((poorly drawn hands)), ((poorly drawn face)), ((mutation)), ((deformed)), blurry, (bad anatomy), (bad proportions), (extra limbs), (disfigured), (malformed limbs), ((missing arms)), ((missing legs)), ((extra arms)), ((extra legs)), (fused fingers), (too many fingers), (long neck), bad_eyes, poorly_drawn_eyes";
      
        promptInfo.prompt += ` width:${ initPacket.width } height:${ initPacket.height }`;
    }
    
    return promptInfo;
}


function constructQualityPrompt(isHighQuality) {

    if (isHighQuality) {
        return "best quality, high rating, (high rating), absurd res, high res, detailed, masterpiece, detailed face, intricate detail, sophisticated detail, exquisite detail, absurd resolution, correct anatomy, 8k, (highly detailed face), highly detailed skin texture, gorgeous, perfect hands";
    } else {
        return "masterpiece, best quality, amazing quality, perfect hands, absurdres, 8k";
    }
}

function appendCompositionPrompt(promptInfo, packet) {

    // looking at viewer, (1girl, solo), (front view, medium shot, dutch angle:1.5),

    if (packet.isMale) {
        promptInfo.prompt += packet.isPair ? "(2boys)" : "(1boy, solo)";
    } else {
        promptInfo.prompt += packet.isPair ? "(2girls)" : "(1girl, solo)";
    }
    
    promptInfo.prompt += ", (" + packet.viewPrompt + ", " + packet.shotPrompt + (packet.isDutchAngle ? ", dutch angle:1.5), " : ":1.5), ");
}

function appendFigurePrompt(promptInfo, packet) {
    
    if (promptInfo.consideredBreasts)
        promptInfo.prompt += constructBreastsPrompt(packet.breasts) + ", ";

    if (promptInfo.consideredBelly)
        promptInfo.prompt += constructBellyPrompt(packet.belly) + ", ";
    
    if (promptInfo.consideredHips)
        promptInfo.prompt += constructHipsPrompt(packet.hips) + ", ";
}

// c.cu, kakuteki, kipteitei, cookiescat, blushyspicy, nekocrispy, stunnerpony, inu-sama, the dogsmith, tsukasawa takamatsu
// c.cu (artist), inkerton-kun(artist), mdf_an(artist), wamudraws(artist), dogsmith(artist), inu-sama(artist), faizenek(artist)

// const artists = [
//     { display_name: "blushyspicy",    value: "blushyspicy(artist)", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgK8Lx11D2D8azuT1eM_l4GytBvz3OaDgcZg&s" },
//     { display_name: "c.cu",           value: "c.cu(artist)", image: "https://cdn.donmai.us/original/17/b1/17b1e5ee5aca849222dc07769ce8fc1c.jpg" },
//     { display_name: "betterwithsalt", value: "betterwithsalt(artist)", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNL5aCFvwGuNr21hmh1k_vZQkG6PUwbGZc1Q&s" },
//     { display_name: "lazorchef",      value: "lazorchef(artist)", image: "https://img3.gelbooru.com/images/33/47/33471ecc92fe4d837008060b655680a7.jpeg" },
//     { display_name: "kipteitei",      value: "kipteitei(artist)", image: "https://us.rule34.xxx//images/1369/df94d57ec4183e3d1388be87554e6800.jpeg?11567121" },
//     { display_name: "spellsx",        value: "spellsx(artist)", image: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f36db054-75cc-4adf-be52-8b8e930ce06a/dfsa3l6-c79e5776-2d3a-47a3-b814-5379f05d57d1.jpg/v1/fill/w_861,h_928,q_70,strp/_as4_7__the_hot_neighbor_by_spellsx_dfsa3l6-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MjE1NyIsInBhdGgiOiJcL2ZcL2YzNmRiMDU0LTc1Y2MtNGFkZi1iZTUyLThiOGU5MzBjZTA2YVwvZGZzYTNsNi1jNzllNTc3Ni0yZDNhLTQ3YTMtYjgxNC01Mzc5ZjA1ZDU3ZDEuanBnIiwid2lkdGgiOiI8PTIwMDAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.T_vWlVrU2mS2V_vzKHspj9Ffkh6VDLFFWLSTgs53iAc" },
// ];

const sizeHeirarchy = [ "small", "slightly big", "big", "slightly huge", "huge", "slightly massive", "massive", "hyper" ]; // giant?

function getSize(value) {
    return sizeHeirarchy[parseInt((value * sizeHeirarchy.length - 1) / 100.0)];
}

// value is in range [1, 100]
function constructBreastsPrompt(value) {

    if (value == 1)
        return "(flat chest)"; // "no breasts"?

    return "(" + getSize(value) + " breasts:1.3)";
}

function constructBellyPrompt(value) {

    if (value == 1)
        return "(slim, no belly, hourglass figure, narrow waist)";

    if (value < 8)
        return "(slim)";
    
    if (value < 16)
        return "(chubby)";

    let extra = "";

    if (value > 80)
        extra += "(large belly, round belly, stuffed belly, pot belly, belly sticking out, fat), ";
    
    return extra + "(" + getSize(value) + " belly:1.3)";
}

function constructHipsPrompt(value) {
    
    let extra = "";

    if (value >= 60)
        extra += "(thick thighs:1." + parseInt(value / 10 - 5) + "), ";
    
    return extra + "(" + getSize(value) + " hips, " + getSize(value) + " ass" + ":1.3)";
}
