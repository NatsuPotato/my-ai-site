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
        return "flat chest";

    return getSize(value) + " breasts";
}

function constructBellyPrompt(value) {

    if (value == 1)
        return "slim"; // no belly, hourglass figure, narrow waist
    
    if (value < 16)
        return "chubby";

    let extra = "";

    if (value > 80) {
        extra += "belly sticking out, round belly, ";
    }
    
    return extra + getSize(value) + " belly";
}

function constructHipsPrompt(value, includeAss) {

    let extra = "";

    if (value > 50)
        extra += "(thick thighs:1." + parseInt(value / 10 - 5) + "), ";

    if (includeAss)
        extra += getSize(value) + " ass, ";
    
    return extra + getSize(value) + " hips";
}

function constructLegsPrompt(value) {

    if (value == 1) {
        return "slender legs";
    }

    let extra = "";

    if (value > 50) {
        extra += "(fat legs, fat knees, fat calves:1." + parseInt(value / 10 - 5) + "), ";
    }
    
    return extra + getSize(value) + " calves";
}

function getPromptFromValues() {

    const output = document.getElementById("output");
    output.value = "";

    const aiyabot = document.getElementById("aiyabot").checked;
    const comments = !aiyabot && document.getElementById("comments").checked;
    const quality = document.getElementById("quality").checked;
    const isMale = document.getElementById("gender").checked;
    const view = document.querySelector('input[name="view"]:checked').value;
    const shot = document.querySelector('input[name="shot"]:checked').value;

    if (aiyabot) {
        output.value += "/draw prompt:";
        document.getElementById("comments-section").style.display = "none";
    } else {
        document.getElementById("comments-section").style.display = "block";
    }

    if (comments)
        output.value += "/* Quality */\n";

    if (quality) {
        output.value += "best quality, high rating, (high rating), absurd res, high res, detailed, masterpiece, detailed face, intricate detail, sophisticated detail, exquisite detail, absurd resolution, correct anatomy, 8k, (highly detailed face), highly detailed skin texture, gorgeous, perfect hands, ";
    } else {
        output.value += "masterpiece, best quality, amazing quality, perfect hands, absurdres, 8k, ";
    }
    
    if (comments)
        output.value += "\n\n/* Composition */\n";

    if (isMale) {
        output.value += document.getElementById("char-count").checked ? "2boys, " : "1boy, ";
    } else {
        output.value += document.getElementById("char-count").checked ? "2girls, " : "1girl, ";
    }
    
    output.value += "(" + view + ":1.2), ";
    output.value += shot + ", ";
    if (document.getElementById("dutch-angle").checked)
        output.value += "dutch angle, ";

    if (comments)
        output.value += "\n\n/* Your stuff */\n";

    output.value += document.getElementById("description").value + ", ";
    
    if (comments)
        output.value += "\n\n/* Figure */\n";

    const showBreasts = shot !== "head shot" && !isMale;
    const showBelly = shot !== "head shot";
    const showHips = shot === "full body shot" || shot === "medium shot";
    const includeAss = view === "side view" || view === "view from behind";
    const showLegs = shot === "full body shot";
    const showAnything = showBreasts || showBelly || showHips || showLegs;
    
    if (showAnything)
        output.value += "(";
    
    if (showBreasts) {
        output.value += constructBreastsPrompt(document.getElementById("breasts-thickness").value);
        document.getElementById("breasts-section").style.display = "table-row";
    } else {
        document.getElementById("breasts-section").style.display = "none";
    }

    if (showBelly) {

        if (showBreasts)
            output.value += ", ";
        
        output.value += constructBellyPrompt(document.getElementById("belly-thickness").value);
        document.getElementById("belly-section").style.display = "table-row";
    } else {
        document.getElementById("belly-section").style.display = "none";
    }
    
    if (showHips) {
        output.value += ", " + constructHipsPrompt(document.getElementById("hips-thickness").value, includeAss);
        document.getElementById("hips-section").style.display = "table-row";
    } else {
        document.getElementById("hips-section").style.display = "none";
    }

    if (showLegs) {
        output.value += ", " + constructLegsPrompt(document.getElementById("legs-thickness").value);
        document.getElementById("legs-section").style.display = "table-row";
    } else {
        document.getElementById("legs-section").style.display = "none";
    }

    if (showAnything)
        output.value += ":1.3)";

    if (aiyabot)
        output.value += ` width:${ document.getElementById("width").value } height:${ document.getElementById("height").value }`;
}
