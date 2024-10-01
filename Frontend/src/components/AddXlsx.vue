<template>
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        <button class="modal-close" @click="$emit('close')">X</button>
        <div class="modal-header">
          <slot name="header"></slot>
        </div>
        <div class="modal-body">
          <slot name="body"></slot>
        </div>
        <div class="modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['visible'],
  };
  </script>
  
  <style scoped>
 @import '../assets/componentscss/xlsx.css';
  </style>
  