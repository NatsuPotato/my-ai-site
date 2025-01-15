function getQualityPresets() {

    return [
        { name: "Simple",  prompt: "masterpiece, best quality, amazing quality, perfect hands, absurdres, 8k" },
        { name: "Complex", prompt: "best quality, high rating, (high rating), absurd res, high res, detailed, masterpiece, detailed face, intricate detail, sophisticated detail, exquisite detail, absurd resolution, correct anatomy, 8k, (highly detailed face), highly detailed skin texture, gorgeous, perfect hands" }
    ];
}

function getFigurePresets() {

    // figure setting presets like "Vore," "Pregnant," "Hourglass," and of course "Thicc Girl"
    
    // fat, obese, big belly, deep navel, large round breasts
    // fat neck, fat face, (vore belly:1.5)
    // chubby
    // (large belly, round belly, stuffed belly, pot belly, belly sticking out, fat)
    // thick thighs
    // "small", "slightly big", "big", "slightly huge", "huge", "slightly massive", "massive", "hyper" ]; // giant?

    return [
        { name: "Hourglass",  prompt: "(slim, no belly, narrow waist)" }
    ];
}

function getArtistsPresets() {

    // c.cu, kakuteki, kipteitei, cookiescat, blushyspicy, nekocrispy, stunnerpony, inu-sama, the dogsmith, tsukasawa takamatsu
    // c.cu (artist), inkerton-kun(artist), mdf_an(artist), wamudraws(artist), dogsmith(artist), inu-sama(artist), faizenek(artist)
    
    // const artists = [
    //     { display_name: "blushyspicy",    value: "blushyspicy(artist)",    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgK8Lx11D2D8azuT1eM_l4GytBvz3OaDgcZg&s" },
    //     { display_name: "c.cu",           value: "c.cu(artist)",           image: "https://cdn.donmai.us/original/17/b1/17b1e5ee5aca849222dc07769ce8fc1c.jpg" },
    //     { display_name: "betterwithsalt", value: "betterwithsalt(artist)", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNL5aCFvwGuNr21hmh1k_vZQkG6PUwbGZc1Q&s" },
    //     { display_name: "lazorchef",      value: "lazorchef(artist)",      image: "https://img3.gelbooru.com/images/33/47/33471ecc92fe4d837008060b655680a7.jpeg" },
    //     { display_name: "kipteitei",      value: "kipteitei(artist)",      image: "https://us.rule34.xxx//images/1369/df94d57ec4183e3d1388be87554e6800.jpeg?11567121" },
    //     { display_name: "spellsx",        value: "spellsx(artist)",        image: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f36db054-75cc-4adf-be52-8b8e930ce06a/dfsa3l6-c79e5776-2d3a-47a3-b814-5379f05d57d1.jpg/v1/fill/w_861,h_928,q_70,strp/_as4_7__the_hot_neighbor_by_spellsx_dfsa3l6-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MjE1NyIsInBhdGgiOiJcL2ZcL2YzNmRiMDU0LTc1Y2MtNGFkZi1iZTUyLThiOGU5MzBjZTA2YVwvZGZzYTNsNi1jNzllNTc3Ni0yZDNhLTQ3YTMtYjgxNC01Mzc5ZjA1ZDU3ZDEuanBnIiwid2lkdGgiOiI8PTIwMDAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.T_vWlVrU2mS2V_vzKHspj9Ffkh6VDLFFWLSTgs53iAc" },
    // ];

    return [
        { name: "test1",          prompt: "c.cu (artist), kakuteki (artist), nekocrispy (artist), stunnerpony (artist), wamudraws (artist)" },
        { name: "test2 (Soft?)",  prompt: "blushyspicy(artist), spellsX(artist), c.cu(artist)" },
        { name: "Realistic",      prompt: "blushyspicy(artist), ((cutesexyrobutts)), icecake, sexyo, spellsX(artist), c.cu(artist)" },
        { name: "Sleek (Humans)", prompt: "blushyspicy(artist), ((cutesexyrobutts)), spellsX(artist), wamudraws (artist)" },
        { name: "Sleek (Anthro)", prompt: "blushyspicy(artist), ((cutesexyrobutts)), spellsX(artist), nekocrispy (artist), stunnerpony (artist), wamudraws (artist)" }
    ];
}



function getPrompt(initPacket, promptPackets) {

    let prompt = "";

    const comments = initPacket.format === "commented";

    if (initPacket.format === "aiyabot")
        prompt += "/draw prompt:";
    
    for (const packet of promptPackets) {

        if (comments)
            prompt += "/* " + packet.packetName.substring(0, 1).toUpperCase() + packet.packetName.substring(1) + " */\n";

        switch (packet.packetName) {

            case "description": prompt += packet.description + ", "; break;

            case "quality":     prompt += getQualityPresets()[packet.index].prompt + ", "; break;
                
            case "figure":      prompt += getFigurePresets()[packet.index].prompt + ", " break;
            
            case "artists":     prompt += getArtistsPresets()[packet.index].prompt + ", "; break;
                
            case "composition": prompt += getCompositionPrompt(packet) + ", "; break;
                
            default:            console.log("Recieved unexpected packet: " + packet.packetName);
        }

        if (comments)
            prompt += "\n\n";
    }

    if (prompt.length >= 2)
        prompt = prompt.substring(0, prompt.length - (comments ? 4 : 2));

    if (initPacket.format === "aiyabot") {

        if (initPacket.useNegatives)
            prompt += " negative_prompt:bad anatomy, bad hands, text, missing finger, extra digits, fewer digits, mutated hands, mutated fingers, poorly drawn face, mutation, deformed face, ugly, bad proportions, bad anatomy, bad hands, text, error, missing fingers, cropped, censored, pixelart, ugly, sketch, lineart, monochrome, duplicate, morbid, mutilated, mutated, missing limbs, missing limb, monster, logo, print, cropped, (worst quality, low quality:1.4), extra fingers, fewer fingers, (bad eyes:1.2), (misfigured pupils:1.2), (bad clothing:1.3), (nonsensical backgrounds:1.2), (bad backgrounds:1.2), (bad shadows:1.2), (bad anatomy:1.1), jpeg artifacts, signature, watermark, username, blurry, out of frame, screenshot, game cg, user interface, source request, commentary request, english commentary, symbol-only commentary, commentary, commission, bad composition, inaccurate eyes, (extra arms:1.2)";
            // previous one: " negative_prompt:(ugly), ((watermark, hourglass)), ((mutilated)), out of frame, extra fingers, extra limbs, mutated hands, ((poorly drawn hands)), ((poorly drawn face)), ((mutation)), ((deformed)), blurry, (bad anatomy), (bad proportions), (extra limbs), (disfigured), (malformed limbs), ((missing arms)), ((missing legs)), ((extra arms)), ((extra legs)), (fused fingers), (too many fingers), (long neck), bad_eyes, poorly_drawn_eyes";
      
        prompt += ` width:${ initPacket.width } height:${ initPacket.height }`;
    }
    
    return prompt;
}

function getCompositionPrompt(packet) {

    // looking at viewer, (1girl, solo), (front view, medium shot, dutch angle:1.5),

    let construct = "";
    
    if (packet.isMale) {
        construct += packet.isPair ? "(2boys)" : "(1boy, solo)";
    } else {
        construct += packet.isPair ? "(2girls)" : "(1girl, solo)";
    }
    
    construct += ", (" + packet.viewPrompt + ", " + packet.shotPrompt + (packet.isDutchAngle ? ", dutch angle:1.5)" : ":1.5)");

    return construct;
}
