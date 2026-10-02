<script setup lang="ts">
const account = useAccount();
const user = computed(() => account.user.value);
const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const preview = ref('');
const removeCurrentAvatar = ref(false);
const successMessage = ref('');
const errorMessage = ref('');
const saving = ref(false);
const fields = reactive({
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  bio: '',
});

watch(
  user,
  (value) => {
    if (!value) return;
    Object.assign(fields, {
      username: value.username,
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
      phone: value.phone,
      bio: value.bio,
    });
  },
  { immediate: true },
);

function selectAvatar(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  successMessage.value = '';
  errorMessage.value = '';
  if (!file) return;
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    errorMessage.value = 'Choose a JPG, PNG, or WebP image.';
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    errorMessage.value = 'Image must be 5 MB or smaller.';
    return;
  }
  if (preview.value) URL.revokeObjectURL(preview.value);
  selectedFile.value = file;
  preview.value = URL.createObjectURL(file);
  removeCurrentAvatar.value = false;
}

function clearAvatarSelection() {
  selectedFile.value = null;
  if (preview.value) URL.revokeObjectURL(preview.value);
  preview.value = '';
  if (fileInput.value) fileInput.value.value = '';
  removeCurrentAvatar.value = true;
}

async function saveProfile() {
  successMessage.value = '';
  errorMessage.value = '';
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(fields.username)) {
    errorMessage.value = 'Username must be 3–20 characters using letters, numbers, or underscores.';
    return;
  }
  saving.value = true;
  try {
    if (selectedFile.value) await account.uploadAvatar(selectedFile.value);
    else if (removeCurrentAvatar.value) await account.removeAvatar();
    account.updateProfile(fields);
    successMessage.value = 'Profile updated successfully.';
    selectedFile.value = null;
    removeCurrentAvatar.value = false;
    if (preview.value) URL.revokeObjectURL(preview.value);
    preview.value = '';
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to save your profile.';
  } finally {
    saving.value = false;
  }
}

onBeforeUnmount(() => {
  if (preview.value) URL.revokeObjectURL(preview.value);
});
useSeoMeta({
  title: 'Edit profile | Dropzone',
  description: 'Update your Dropzone player profile.',
});
</script>

<template>
  <AccountShell>
    <section class="account-panel profile-edit-panel">
      <div class="account-section-heading">
        <div>
          <span class="account-overline">YOUR PLAYER CARD</span>
          <h2>Edit profile</h2>
          <p>Keep your player details current.</p>
        </div>
      </div>
      <form class="profile-edit-form" @submit.prevent="saveProfile">
        <div class="profile-avatar-editor">
          <div class="profile-avatar-preview">
            <img v-if="preview" :src="preview" alt="Preview of selected avatar" />
            <UserAvatar
              v-else
              :avatar="removeCurrentAvatar ? null : (user?.avatar ?? null)"
              :name="fields.firstName || fields.username || 'Player'"
              size="xl"
            />
          </div>
          <div>
            <strong>Profile picture</strong>
            <p>JPG, PNG, or WebP · up to 5 MB · 64–4096 px</p>
            <div class="avatar-edit-actions">
              <button type="button" class="account-small-button" @click="fileInput?.click()">
                Choose image</button
              ><button
                v-if="user?.avatar || preview"
                type="button"
                class="account-text-button"
                @click="clearAvatarSelection"
              >
                Remove
              </button>
            </div>
          </div>
          <input
            ref="fileInput"
            class="sr-only"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            @change="selectAvatar"
          />
        </div>
        <div class="profile-form-grid">
          <label class="account-field account-field-wide"
            ><span>Username</span
            ><input
              v-model.trim="fields.username"
              autocomplete="username"
              required
              minlength="3"
              maxlength="20"
          /></label>
          <label class="account-field"
            ><span>First name</span
            ><input v-model.trim="fields.firstName" autocomplete="given-name"
          /></label>
          <label class="account-field"
            ><span>Last name</span><input v-model.trim="fields.lastName" autocomplete="family-name"
          /></label>
          <label class="account-field account-field-wide"
            ><span>Email address</span
            ><input v-model.trim="fields.email" type="email" autocomplete="email" required
          /></label>
          <label class="account-field"
            ><span>Phone number <small>Optional</small></span
            ><input v-model.trim="fields.phone" type="tel" autocomplete="tel"
          /></label>
          <label class="account-field account-field-wide"
            ><span>About me <small>Optional</small></span
            ><textarea
              v-model.trim="fields.bio"
              maxlength="240"
              rows="3"
              placeholder="What do you play? What is your main?"
            />
          </label>
        </div>
        <p v-if="successMessage" class="account-form-message account-success" role="status">
          {{ successMessage }}
        </p>
        <p v-if="errorMessage" class="account-form-message account-error" role="alert">
          {{ errorMessage }}
        </p>
        <div class="profile-form-footer">
          <span
            >Account created {{ user ? new Date(user.createdAt).toLocaleDateString() : '' }}</span
          ><Button type="submit" :loading="saving"
            >Save changes <span aria-hidden="true">↗</span></Button
          >
        </div>
      </form>
    </section>
  </AccountShell>
</template>
