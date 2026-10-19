<script>
  import { enhance } from '$app/forms';
  import { loginSchema } from '#lib/contracts.js';
  import { t, localized as l } from '#lib/i18n/index.js';
  import Seo from '#lib/components/Seo.svelte';
  import Input from '#lib/components/Input.svelte';
  import Button from '#lib/components/Button.svelte';
  /** @type {{data:import('./$types').PageData,form:import('./$types').ActionData}} */ let {
    data,
    form,
  } = $props();
  let email = $state('');
  let password = $state('');
  let invalid = $state(false);
  let pending = $state(false);
</script>

<Seo
  title={t(data.locale, 'login.title')}
  description={l(
    data.locale,
    'Sign in to your campaign workspace.',
    'Melde dich in deinem Arbeitsbereich an.',
  )}
  locale={data.locale}
  noindex
/>
<main id="main" class="login-grid">
  <section class="login-story grid-lines">
    <p class="eyebrow">Campaign Studio</p>
    <h1>
      {l(
        data.locale,
        'A clear view.\nA fresh start.',
        'Klarer Blick.\nNeuer Start.',
      )}
    </h1>
    <p class="muted max-w-sm text-lg leading-relaxed">
      {l(
        data.locale,
        'Your campaigns and your team, together in one considered workspace.',
        'Deine Kampagnen und dein Team in einem durchdachten Arbeitsbereich.',
      )}
    </p>
    <div class="quote">
      <span class="text-4xl" aria-hidden="true">“</span>
      <p>
        {l(
          data.locale,
          'The best tools make space for your thinking.',
          'Die besten Werkzeuge schaffen Raum zum Denken.',
        )}
      </p>
      <p class="text-xs muted mt-4">
        {l(data.locale, 'Our guiding principle', 'Unser Leitgedanke')}
      </p>
    </div>
  </section>
  <section class="login-form">
    <div class="w-full max-w-sm">
      <p class="eyebrow mb-4">
        {l(data.locale, 'Welcome back', 'Willkommen zurück')}
      </p>
      <h2 class="text-3xl font-semibold tracking-tight">
        {t(data.locale, 'login.title')}
      </h2>
      <p class="muted mt-3 mb-8">
        {l(
          data.locale,
          'Good to see you. Let’s get you settled in.',
          'Schön, dich zu sehen. Legen wir los.',
        )}
      </p>
      <form
        method="POST"
        class="grid gap-5"
        use:enhance={({ formData, cancel }) => {
          invalid = !loginSchema.safeParse(Object.fromEntries(formData))
            .success;
          if (invalid) {
            cancel();
            return;
          }
          pending = true;
          return async ({ update }) => {
            await update();
            pending = false;
          };
        }}
      >
        <Input
          id="email"
          type="email"
          label={t(data.locale, 'login.email')}
          bind:value={email}
          autocomplete="username"
          required
        /><Input
          id="password"
          type="password"
          label={t(data.locale, 'login.password')}
          bind:value={password}
          autocomplete="current-password"
          required
        />
        {#if invalid || form?.invalid}<p class="error" role="alert">
            {invalid
              ? l(
                  data.locale,
                  'Enter a valid email and a password with at least 8 characters.',
                  'Gültige E-Mail und Passwort mit mindestens 8 Zeichen eingeben.',
                )
              : t(data.locale, 'login.error')}
          </p>{/if}
        <Button type="submit" disabled={pending}
          >{pending
            ? t(data.locale, 'common.loading')
            : t(data.locale, 'login.submit')}
          <span aria-hidden="true">→</span></Button
        >
      </form>
      <div class="bg-soft rounded-control p-4 mt-8 text-xs leading-6">
        <p class="font-semibold">
          {l(data.locale, 'Take a look around', 'Sieh dich um')}
        </p>
        <p class="muted">
          admin@demo.test · editor@demo.test · viewer@demo.test
        </p>
        <p class="muted">
          {t(data.locale, 'login.password')}: <code>demo1234</code>
        </p>
        <p class="muted mt-2">
          {l(
            data.locale,
            'Admin and editor can edit. Viewer is read-only.',
            'Admin und Editor können bearbeiten. Viewer hat Lesezugriff.',
          )}
        </p>
      </div>
    </div>
  </section>
</main>

<style>
  .login-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: calc(100vh - 170px);
  }
  .login-story {
    padding: 80px clamp(30px, 6vw, 100px);
    background-color: var(--soft);
  }
  .login-story h1 {
    white-space: pre-line;
    font-size: clamp(40px, 5vw, 70px);
    letter-spacing: -0.05em;
    line-height: 1.07;
    font-weight: 600;
    margin: 35px 0 28px;
  }
  .login-form {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 28px;
    background: var(--surface);
  }
  .quote {
    margin-top: 70px;
    max-width: 310px;
    font-size: 20px;
    line-height: 1.5;
  }
  @media (max-width: 850px) {
    .login-grid {
      grid-template-columns: 1fr;
    }
    .login-story {
      display: none;
    }
  }
</style>
