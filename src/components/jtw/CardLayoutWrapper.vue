<template>
  <v-row>
    <v-col cols="3" v-for="n in 5" :key="n">
      <v-card class="elevation-1" border>
        {{ n }}
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup></script>

<style scoped></style>
