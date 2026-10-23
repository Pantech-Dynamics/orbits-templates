<script lang="ts">
  import { enhance } from "$app/forms";
  import { days, EVENT, formatDay, formatTime, speakerById, SPEAKERS, TICKETS } from "#lib/event.ts";
  import type { PageProps } from "./$types";

  let { data, form }: PageProps = $props();

  const schedule = days();
  let day = $state(0);
  let pending = $state(false);
  const now = $derived(new Date(data.now).getTime());
  const live = (s: { start: string; end: string }) => now >= Date.parse(s.start) && now < Date.parse(s.end);
  const initials = (name: string) => name.split(" ").map((p) => p[0]).join("");
</script>

<svelte:head>
  <title>{EVENT.name}</title>
  <meta name="description" content={EVENT.tagline} />
  <meta property="og:title" content={EVENT.name} />
  <meta property="og:description" content={EVENT.tagline} />
</svelte:head>

<header class="hero">
  <nav class="bar">
    <strong>{EVENT.name}</strong>
    <div>
      <a href="#schedule">Schedule</a>
      <a href="#speakers">Speakers</a>
      <a href="#tickets" class="pill">Get tickets</a>
    </div>
  </nav>
  <div class="hero-body">
    <p class="when">{formatDay(EVENT.start)} – {formatDay(EVENT.end)} · {EVENT.city}</p>
    <h1>{EVENT.name}</h1>
    <p class="tagline">{EVENT.tagline}</p>
    <div class="actions">
      <a href="#tickets" class="button">Get your ticket</a>
      <a href="/calendar.ics" class="button ghost">Add to calendar</a>
    </div>
    <p class="venue">{EVENT.venue}</p>
  </div>
</header>

<main>
  <section id="schedule" class="section">
    <h2>Schedule</h2>
    <div class="tabs" role="tablist">
      {#each schedule as d, i (d.label)}
        <button role="tab" aria-selected={day === i} onclick={() => (day = i)}>Day {i + 1}<span>{d.label}</span></button>
      {/each}
    </div>
    <ol class="sessions">
      {#each schedule[day].sessions as s (s.start)}
        {@const speaker = speakerById(s.speaker)}
        <li class={[s.kind, live(s) && "live"]}>
          <time datetime={s.start}>{formatTime(s.start)}<span>{formatTime(s.end)}</span></time>
          <div>
            {#if live(s)}<p class="now">Happening now</p>{/if}
            <h3>{s.title}</h3>
            <p class="meta">
              {#if speaker}{speaker.name} · {/if}{s.room}{#if s.kind === "workshop"} · Workshop{/if}
            </p>
          </div>
        </li>
      {/each}
    </ol>
  </section>

  <section id="speakers" class="section">
    <h2>Speakers</h2>
    <div class="speakers">
      {#each SPEAKERS as s (s.id)}
        <article>
          <span class="avatar" aria-hidden="true">{initials(s.name)}</span>
          <h3>{s.name}</h3>
          <p class="role">{s.role}</p>
          <p>{s.bio}</p>
        </article>
      {/each}
    </div>
  </section>

  <section id="tickets" class="section">
    <h2>Tickets</h2>
    <div class="tickets">
      {#each TICKETS as t (t.name)}
        <article class={{ free: t.rsvp }}>
          <h3>{t.name}</h3>
          <p class="price">{t.price}</p>
          <p>{t.blurb}</p>
          {#if t.rsvp}
            {#if form?.done}
              <p class="done" role="status">
                {form.already ? `You're already on the list, ${form.name}.` : `You're in, ${form.name}. See you there.`}
              </p>
            {:else}
              <form
                method="post"
                action="?/rsvp"
                use:enhance={() => {
                  pending = true;
                  return async ({ update }) => {
                    await update();
                    pending = false;
                  };
                }}
              >
                <input name="name" placeholder="Your name" autocomplete="name" required value={form?.name ?? ""} aria-label="Name" />
                <input name="email" type="email" placeholder="you@example.com" autocomplete="email" required value={form?.email ?? ""} aria-label="Email" />
                {#if form?.error}<p class="error" role="alert">{form.error}</p>{/if}
                <button disabled={pending}>{pending ? "Saving your place…" : "RSVP for free"}</button>
                <p class="left">{data.placesLeft} places left</p>
              </form>
            {/if}
          {:else}
            <a href={t.href} class="button" rel="noopener">Buy</a>
          {/if}
        </article>
      {/each}
    </div>
  </section>
</main>

<footer>
  <p>{EVENT.name} · {EVENT.venue}, {EVENT.city}</p>
</footer>
