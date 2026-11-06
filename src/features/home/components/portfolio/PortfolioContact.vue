<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { contactLinks, emailJs } from "../../../../content/portfolio";
import Linkedin from "../../../../components/icons/Linkedin.vue";
import Github from "../../../../components/icons/Github.vue";
import Button from "../../../../components/Button.vue";

const icons = { linkedin: Linkedin, github: Github };

const form = reactive({ fullname: "", email: "", message: "" });
const status = ref<"idle" | "sending" | "success" | "error">("idle");

const canSubmit = computed(
  () =>
    status.value !== "sending" && form.fullname.trim() !== "" && form.email.trim() !== "" && form.message.trim() !== "",
);

const statusMessage = computed(() => {
  switch (status.value) {
    case "sending":
      return "Sending…";
    case "success":
      return "Thanks! Your message is on its way. I'll get back to you soon.";
    case "error":
      return "Couldn't send your message. Please try again, or reach me on LinkedIn.";
    default:
      return "";
  }
});

const handleSubmit = async () => {
  if (!canSubmit.value) return;
  status.value = "sending";

  try {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: emailJs.serviceId,
        template_id: emailJs.templateId,
        user_id: emailJs.publicKey,
        template_params: { ...form },
      }),
    });
    if (!response.ok) throw new Error(`EmailJS responded with ${response.status}`);

    status.value = "success";
    form.fullname = "";
    form.email = "";
    form.message = "";
  } catch (error) {
    console.error(error);
    status.value = "error";
  }
};
</script>

<template>
  <div class="contact">
    <ul class="contact-links">
      <li v-for="link in contactLinks" :key="link.url">
        <a class="contact-link" :href="link.url" target="_blank" rel="noopener" data-hoversound="hover">
          <component :is="icons[link.icon]" class="contact-link-icon" />
          {{ link.label }}
        </a>
      </li>
    </ul>

    <h3 class="contact-subtitle">Send a message</h3>
    <form class="contact-form" @submit.prevent="handleSubmit">
      <div class="contact-row">
        <label class="contact-field">
          <span>Full name</span>
          <input v-model="form.fullname" type="text" name="fullname" autocomplete="name" required />
        </label>
        <label class="contact-field">
          <span>Email address</span>
          <input v-model="form.email" type="email" name="email" autocomplete="email" required />
        </label>
      </div>
      <label class="contact-field">
        <span>Message</span>
        <textarea v-model="form.message" name="message" rows="5" required></textarea>
      </label>

      <Button
        class="contact-submit"
        variant="accent"
        type="submit"
        :disabled="!canSubmit"
        data-cursor="circle-white"
        data-hoversound="hover"
      >
        {{ status === "sending" ? "Sending…" : "Send message" }}
      </Button>
      <p class="contact-status" :class="`contact-status-${status}`" role="status" aria-live="polite">
        {{ statusMessage }}
      </p>
    </form>
  </div>
</template>

<style scoped lang="scss">
.contact {
  &-links {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  &-link {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    min-height: 44px;
    padding: 0 18px;
    border: 1px solid var(--border-light);
    border-radius: 999px;
    background-color: var(--surface-light);
    color: var(--text-dark);
    font-size: 15px;
    font-weight: 700;
    text-decoration: none;
    --icon-color: var(--cyan-dark);
    transition:
      border-color 0.2s ease,
      transform 0.2s ease;

    @include mixins.hover {
      &:hover {
        border-color: var(--cyan-dark);
        transform: translateY(-1px);
      }
    }

    &-icon {
      width: 18px;
      height: 18px;
    }
  }

  &-subtitle {
    margin: 36px 0 16px;
    color: var(--text-dark);
    font-size: var(--type-h3);
  }

  &-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &-row {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  &-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    color: var(--text-dark);
    font-size: var(--type-small);
    font-weight: 700;

    input,
    textarea {
      width: 100%;
      padding: 12px 14px;
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      background-color: var(--surface-light);
      color: var(--text-dark);
      font-family: inherit;
      font-size: var(--type-body);
      font-weight: 400;
      resize: vertical;
      transition: border-color 0.2s ease;

      &:focus {
        border-color: var(--cyan-dark);
        outline: 2px solid var(--focus-ring);
        outline-offset: 1px;
      }
    }
  }

  &-submit {
    align-self: flex-start;
  }

  &-status {
    min-height: 1.5em;
    color: var(--text-muted);
    font-size: 15px;

    &-success {
      color: var(--text-dark);
    }

    &-error {
      color: var(--magenta-hover);
    }
  }
}

@media (max-width: 640px) {
  .contact-row {
    grid-template-columns: 1fr;
  }
}
</style>
