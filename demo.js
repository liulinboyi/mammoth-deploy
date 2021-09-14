(function() {
    document.getElementById("document")
        .addEventListener("change", handleFileSelect, false);
    const btn = document.querySelector("#print")
    btn.addEventListener("click", function() {
        print()
    })
    const iframe = document.createElement("iframe")
    iframe.style.display = "none"
    document.body.appendChild(iframe)
    setTimeout(() => { // fix firefox bug
        iframe.contentWindow.window.document.body.innerHTML = "mammoth.browser"
    })
    console.log(iframe.contentWindow.window.document.body)
    function handleFileSelect(event) {
        btn.disabled = true
        readFileInputEventAsArrayBuffer(event, function(arrayBuffer) {
            mammoth.convertToHtml({arrayBuffer: arrayBuffer})
                .then(displayResult)
                .done(function() {
                    console.log('done')
                    btn.disabled = false
                });
        });
    }

    function print() {
        const cp = document.querySelector(".span8").innerHTML
        iframe.contentWindow.window.document.body.innerHTML = cp
        try {
            iframe.contentWindow.window.print()
        } catch (error) {
            alert("打印发生了错误，请重试！")
        }
    }
    
    function displayResult(result) {
        document.getElementById("output").innerHTML = result.value;
        
        var messageHtml = result.messages.map(function(message) {
            return '<li class="' + message.type + '">' + escapeHtml(message.message) + "</li>";
        }).join("");
        
        document.getElementById("messages").innerHTML = "<ul>" + messageHtml + "</ul>";
    }
    
    function readFileInputEventAsArrayBuffer(event, callback) {
        var file = event.target.files[0];

        var reader = new FileReader();
        
        reader.onload = function(loadEvent) {
            var arrayBuffer = loadEvent.target.result;
            callback(arrayBuffer);
        };
        
        reader.readAsArrayBuffer(file);
    }

    function escapeHtml(value) {
        return value
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }
})();
