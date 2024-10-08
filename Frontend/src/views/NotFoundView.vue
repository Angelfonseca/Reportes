<template>
    <div class="not-found">
        <div class="error-content">
            <h1 class="error-code">404</h1>
            <p class="error-message">Oops! The page you're looking for can't be found.</p>
        </div>
        <div class="background-elements">
            <div class="circle"></div>
            <div class="triangle"></div>
            <div class="square"></div>
        </div>
    </div>
</template>

<style>
.not-found {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f0f4f8;
    position: relative;
    overflow: hidden;
    font-family: 'Arial', sans-serif;
}

.error-content {
    z-index: 2;
    text-align: center;
}

.error-code {
    font-size: 120px;
    color: #2c3e50;
    margin: 0;
}

.error-message {
    font-size: 20px;
    color: #34495e;
    margin-top: 20px;
}

.background-elements {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    overflow: hidden;
}

.circle,
.triangle,
.square {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.05);
}

.circle {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    top: -100px;
    left: -100px;
}

.triangle {
    width: 0;
    height: 0;
    border-left: 150px solid transparent;
    border-right: 150px solid transparent;
    border-bottom: 260px solid rgba(0, 0, 0, 0.05);
    top: -130px;
    right: -50px;
}

.square {
    width: 250px;
    height: 250px;
    top: 60%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(45deg);
}
</style>