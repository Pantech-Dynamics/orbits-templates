<script lang="ts">
  import { enhance } from "$app/forms";
  import { page } from "$app/state";
  import { days, EVENT, formatDay, formatTime, SCHEDULE, speakerById, SPEAKERS, TICKETS } from "#lib/event.ts";
  import type { PageProps } from "./$types";

  let { data, form }: PageProps = $props();

  const schedule = days();
  let day = $state(0);
  let pending = $state(false);
  const now = $derived(new Date(data.now).getTime());
  const live = (s: { start: string; end: string }) => now >= Date.parse(s.start) && now < Date.parse(s.end);
  const initials = (name: string) => name.split(" ").map((p) => p[0]).join("");
  const KIND = { talk: null, workshop: { label: "Workshop", tone: "accent" }, break: { label: "Break", tone: "plain" } } as const;
</script>

<svelte:head>
  <title>{EVENT.name}</title>
  <meta name="description" content={EVENT.tagline} />
  <meta property="og:title" content={EVENT.name} />
  <meta property="og:description" content={EVENT.tagline} />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="{__SITE_URL__ || page.url.origin}/og.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="{EVENT.name}: {EVENT.tagline}" />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<header class="bar">
  <div class="wrap bar-row">
    <a href="/" class="brand"><span class="tile solid">{EVENT.name.slice(0, 1)}</span>{EVENT.name}</a>
    <nav>
      <a href="#schedule">Schedule</a>
      <a href="#speakers">Speakers</a>
    </nav>
    <a href="#tickets" class="btn btn-primary btn-sm">Get tickets</a>
  </div>
</header>

<main class="wrap stack">
  <section class="panel hero">
    <div class="hero-copy">
      <p class="eyebrow reveal"><span class="badge accent">{formatDay(EVENT.start)} – {formatDay(EVENT.end)}</span> {EVENT.city}</p>
      <h1 class="title reveal" style="--delay: 40ms">{EVENT.name}</h1>
      <p class="tagline reveal" style="--delay: 80ms">{EVENT.tagline}</p>
      <div class="actions reveal" style="--delay: 120ms">
        <a href="#tickets" class="btn btn-primary btn-lg">Get your ticket</a>
        <a href="/calendar.ics" class="btn btn-lg">Add to calendar</a>
      </div>
    </div>
    <dl class="facts hatch">
      <div class="panel reveal" style="--delay: 160ms"><dt class="label">Days</dt><dd>{schedule.length}</dd></div>
      <div class="panel reveal" style="--delay: 200ms"><dt class="label">Speakers</dt><dd>{SPEAKERS.length}</dd></div>
      <div class="panel reveal" style="--delay: 240ms"><dt class="label">Sessions</dt><dd>{SCHEDULE.filter((s) => s.kind !== "break").length}</dd></div>
      <div class="panel reveal" style="--delay: 280ms"><dt class="label">Free places left</dt><dd>{data.placesLeft}</dd></div>
      <div class="panel venue reveal" style="--delay: 320ms"><dt class="label">Venue</dt><dd>{EVENT.venue}</dd></div>
    </dl>
  </section>

  <section id="schedule" class="panel rise">
    <div class="panel-head">
      <h2>Schedule</h2>
      <div class="segmented" role="tablist" aria-label="Day">
        {#each schedule as d, i (d.label)}
          <button role="tab" aria-selected={day === i} onclick={() => (day = i)}>Day {i + 1}<span>{d.label}</span></button>
        {/each}
      </div>
    </div>
    <ol class="sessions">
      {#each schedule[day].sessions as s, i (s.start)}
        {@const speaker = speakerById(s.speaker)}
        {@const kind = KIND[s.kind]}
        <li class={["reveal", s.kind, live(s) && "live"]} style="--delay: {Math.min(i, 8) * 25}ms">
          <time class="mono" datetime={s.start}>{formatTime(s.start)}<span>{formatTime(s.end)}</span></time>
          <div class="session">
            <h3>{s.title}</h3>
            <p class="meta">
              {#if speaker}<span class="tile">{initials(speaker.name)}</span><span>{speaker.name}</span><span>·</span>{/if}<span>{s.room}</span>
            </p>
          </div>
          {#if live(s)}
            <span class="badge green">Happening now</span>
          {:else if kind}
            <span class="badge {kind.tone}">{kind.label}</span>
          {/if}
        </li>
      {/each}
    </ol>
  </section>

  <section id="speakers" class="section">
    <h2 class="section-title rise">Speakers</h2>
    <div class="speakers">
      {#each SPEAKERS as s (s.id)}
        <article class="panel rise">
          <span class="tile avatar" aria-hidden="true">{initials(s.name)}</span>
          <h3 class="subheading">{s.name}</h3>
          <p class="role">{s.role}</p>
          <p>{s.bio}</p>
        </article>
      {/each}
    </div>
  </section>

  <section id="tickets" class="section">
    <h2 class="section-title rise">Tickets</h2>
    <div class="tickets">
      {#each TICKETS as t (t.name)}
        <article class={["panel ticket rise", t.rsvp && "free"]}>
          <div class="ticket-top">
            <h3 class="subheading">{t.name}</h3>
            {#if t.rsvp}<span class="badge amber">{data.placesLeft} places left</span>{/if}
          </div>
          <p class="price">{t.price}</p>
          <p class="blurb">{t.blurb}</p>
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
                <input class="input" name="name" placeholder="Your name" autocomplete="name" required value={form?.name ?? ""} aria-label="Name" />
                <input class="input" name="email" type="email" placeholder="you@example.com" autocomplete="email" required value={form?.email ?? ""} aria-label="Email" />
                {#if form?.error}<p class="error" role="alert">{form.error}</p>{/if}
                <button class="btn btn-primary btn-lg" disabled={pending}>{pending ? "Saving your place…" : "RSVP for free"}</button>
              </form>
            {/if}
          {:else}
            <a href={t.href} class="btn btn-lg" rel="noopener">Buy</a>
          {/if}
        </article>
      {/each}
    </div>
  </section>
</main>

<footer class="wrap foot">
  <span class="tile">{EVENT.name.slice(0, 1)}</span>
  {EVENT.name} · {EVENT.venue}, {EVENT.city}
</footer>
