<template>
  <ServiceSelection />
  <StylistSelection />
  <DateTimePicker />
  <Confirmation />
</template>
<script setup lang="ts">
import ServiceSelection from "../components/features/appointmentSection/ServiceSelection.vue";
import StylistSelection from "../components/features/appointmentSection/StylistSelection.vue";
import DateTimePicker from "../components/features/appointmentSection/DateTimePicker.vue";
import Confirmation from "../components/features/appointmentSection/Confirmation.vue";
</script>
