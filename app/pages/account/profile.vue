<script setup lang="ts">
const account = useAccount();
const user = computed(() => account.user.value);
const fileInput = ref<{ click: () => void; clear: () => void } | null>(null);
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
  fileInput.value?.clear();
  removeCurrentAvatar.value = true;
}

async function saveProfile() {
  successMessage.value = '';
  errorMessage.value = '';
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(fields.username)) {
    errorMessage.value = 'Username must be 3–20 characters using letters, numbers, or underscores.';
    return;
  }
  if (saving.value) return;
  const profile = { ...fields };
  const ownerId = user.value?.id;
  saving.value = true;
  try {
    if (selectedFile.value) await account.uploadAvatar(selectedFile.value);
    else if (removeCurrentAvatar.value) await account.removeAvatar();
    if (user.value?.id !== ownerId) throw new Error('Your session changed. Please try again.');
    account.updateProfile(profile);
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
    <Card as="section" class="account-panel profile-edit-panel">
      <CardHeader class="account-section-heading">
        <div>
          <span class="account-overline">YOUR PLAYER CARD</span>
          <h2>Edit profile</h2>
          <CardDescription>Keep your player details current.</CardDescription>
        </div>
      </CardHeader>
      <form class="profile-edit-form" @submit.prevent="saveProfile">
        <div class="profile-avatar-editor">
          <div class="profile-avatar-preview">
            <img v-if="preview" :src="preview" alt="Preview of selected avatar" >
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
              <Button
                variant="secondary"
                size="sm"
                type="button"
                class="account-small-button"
                @click="fileInput?.click()"
              >
                Choose image</Button
              ><Button
                v-if="user?.avatar || preview"
                variant="danger"
                size="sm"
                type="button"
                class="account-text-button"
                @click="clearAvatarSelection"
              >
                Remove
              </Button>
            </div>
          </div>
          <Input
            ref="fileInput"
            class="sr-only"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            @change="selectAvatar"
          />
        </div>
        <div class="profile-form-grid">
          <FormField class="account-field account-field-wide" label="Username" input-id="profile-1"
            ><Input
              id="profile-1"
              v-model.trim="fields.username"
              autocomplete="username"
              required
              minlength="3"
              maxlength="20"
          /></FormField>
          <FormField class="account-field" label="First name" input-id="profile-2"
            ><Input id="profile-2" v-model.trim="fields.firstName" autocomplete="given-name"
          /></FormField>
          <FormField class="account-field" label="Last name" input-id="profile-3"
            ><Input id="profile-3" v-model.trim="fields.lastName" autocomplete="family-name"
          /></FormField>
          <FormField
            class="account-field account-field-wide"
            label="Email address"
            input-id="profile-4"
            ><Input
              id="profile-4"
              v-model.trim="fields.email"
              type="email"
              autocomplete="email"
              required
          /></FormField>
          <FormField class="account-field" label="Phone number" input-id="profile-5"
            ><Input id="profile-5" v-model.trim="fields.phone" type="tel" autocomplete="tel"
          /></FormField>
          <FormField class="account-field account-field-wide" label="About me" input-id="profile-6"
            ><Textarea
              id="profile-6"
              v-model.trim="fields.bio"
              maxlength="240"
              :rows="3"
              placeholder="What do you play? What is your main?"
            />
          </FormField>
        </div>
        <p v-if="successMessage" class="account-form-message account-success" role="status">
          {{ successMessage }}
        </p>
        <p v-if="errorMessage" class="account-form-message account-error" role="alert">
          {{ errorMessage }}
        </p>
        <CardFooter class="profile-form-footer">
          <span
            >Account created {{ user ? new Date(user.createdAt).toLocaleDateString() : '' }}</span
          ><Button type="submit" :loading="saving"
            >Save changes <span aria-hidden="true">↗</span></Button
          >
        </CardFooter>
      </form>
    </Card>
  </AccountShell>
</template>
