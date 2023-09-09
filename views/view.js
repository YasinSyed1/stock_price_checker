// Add interactivity to the button click using JavaScript
document.getElementById("testForm2").addEventListener("submit", function (e) {
    e.preventDefault();
    const input = document.querySelector('input[name="stock"]');
    const likeCheckbox = document.querySelector('input[name="like"]');
    const jsonResult = document.getElementById("jsonResult");
  
    // Simulate an API request (you can replace this with your actual API request)
    setTimeout(function () {
      const stockData = {
        stock: input.value,
        price: Math.random() * 1000, // Simulated price
        likes: likeCheckbox.checked ? 1 : 0,
      };
  
      jsonResult.textContent = JSON.stringify({ stockData }, null, 2);
    }, 1000); // Simulated delay for demonstration
  
    // Reset the form
    input.value = "";
    likeCheckbox.checked = false;
  });
  
  // Add interactivity to the button click for the second form (comparison)
  document.getElementById("testForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const input1 = document.querySelector('input[name="stock"]:nth-of-type(1)');
    const input2 = document.querySelector('input[name="stock"]:nth-of-type(2)');
    const likeCheckbox = document.querySelector('input[name="like"]');
    const jsonResult = document.getElementById("jsonResult");
  
    // Simulate an API request (you can replace this with your actual API request)
    setTimeout(function () {
      const stockData1 = {
        stock: input1.value,
        price: Math.random() * 1000, // Simulated price
        likes: likeCheckbox.checked ? 1 : 0,
      };
  
      const stockData2 = {
        stock: input2.value,
        price: Math.random() * 1000, // Simulated price
        likes: likeCheckbox.checked ? 1 : 0,
      };
  
      const relLikes = stockData1.likes - stockData2.likes;
  
      const response = {
        stockData: [
          {
            stock: stockData1.stock,
            price: stockData1.price,
            rel_likes: relLikes,
          },
          {
            stock: stockData2.stock,
            price: stockData2.price,
            rel_likes: -relLikes,
          },
        ],
      };
  
      jsonResult.textContent = JSON.stringify(response, null, 2);
    }, 1000); // Simulated delay for demonstration
  
    // Reset the form
    input1.value = "";
    input2.value = "";
    likeCheckbox.checked = false;
  });
  