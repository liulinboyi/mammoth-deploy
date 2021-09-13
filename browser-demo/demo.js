(function() {
    document.getElementById("document")
        .addEventListener("change", handleFileSelect, false);
    let btn = document.querySelector("#print")
    btn.addEventListener("click", function() {
        print()
    })
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
        const frame = document.createElement("iframe")
        frame.style.display = "none"
        document.body.appendChild(frame)
        const cp = document.querySelector(".span8").cloneNode(true)
        frame.contentWindow.window.document.body.appendChild(cp)
        frame.contentWindow.window.print()
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
