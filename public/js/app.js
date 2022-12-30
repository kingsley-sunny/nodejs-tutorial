window.onload = () => {
    const button = document.querySelector("#button");
    const result = document.querySelector(".result");

    (async () => {
        const response = await fetch("http://localhost:3000/api/file");
        const data = await response.text();

        console.log(data);
        result.textContent = data;
    })();

    // button.addEventListener("click", () => {});
};
