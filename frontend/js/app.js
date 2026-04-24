import { api } from './api.js';
import { DEMO_QUOTES, DEMO_RESOURCES, DEMO_THERAPISTS } from './config.js';

const state = {
  profile: JSON.parse(localStorage.getItem('mindease_user') || 'null'),
  moodEntries: JSON.parse(localStorage.getItem('mindease_moods') || '[]'),
  journalEntries: JSON.parse(localStorage.getItem('mindease_journal') || '[]'),
  bookings: JSON.parse(localStorage.getItem('mindease_bookings') || '[]'),
  theme: localStorage.getItem('mindease_theme') || 'light'
};

const routePage = document.body.dataset.page;
document.body.classList.toggle('theme-dark', state.theme === 'dark');

const els = {
  toast: document.getElementById('toast')
};

const formatDate = (value) =>
  new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const formatDateTime = (date, time) => `${formatDate(date)} at ${time}`;

const saveLocal = () => {
  localStorage.setItem('mindease_moods', JSON.stringify(state.moodEntries));
  localStorage.setItem('mindease_journal', JSON.stringify(state.journalEntries));
  localStorage.setItem('mindease_bookings', JSON.stringify(state.bookings));
  localStorage.setItem('mindease_theme', state.theme);
  if (state.profile) {
    localStorage.setItem('mindease_user', JSON.stringify(state.profile));
  }
};

const notify = (message, type = 'success') => {
  if (!els.toast) return;
  els.toast.textContent = message;
  els.toast.className =
    'fixed bottom-4 right-4 z-50 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-2xl transition ' +
    (type === 'error' ? 'bg-rose-500' : 'bg-slate-900');
  els.toast.classList.remove('hidden');
  setTimeout(() => els.toast.classList.add('hidden'), 2600);
};

const setGreeting = () => {
  document.querySelectorAll('[data-user-name]').forEach((node) => {
    node.textContent = state.profile?.name || 'Sana';
  });
};

const getQuoteOfDay = () => {
  const dayIndex = new Date().getDate() % DEMO_QUOTES.length;
  return DEMO_QUOTES[dayIndex];
};

const computeWellnessScore = (entry) => {
  if (!entry) return 78;
  const sleepScore = Math.min((entry.sleepHours / 8) * 30, 30);
  const stressScore = Math.max(0, 35 - entry.stressLevel * 3);
  const anxietyScore = Math.max(0, 35 - entry.anxietyLevel * 3);
  return Math.round(Math.min(100, sleepScore + stressScore + anxietyScore));
};

const currentMood = () => state.moodEntries[0];

const renderStats = () => {
  const latest = currentMood();
  const score = computeWellnessScore(latest);
  const streak = new Set(state.moodEntries.map((item) => formatDate(item.createdAt || item.date))).size;
  const bookingCount = state.bookings.filter((item) => item.status !== 'cancelled').length;
  const journalCount = state.journalEntries.length;

  document.querySelectorAll('[data-wellness-score]').forEach((node) => (node.textContent = `${score}%`));
  document.querySelectorAll('[data-streak]').forEach((node) => (node.textContent = `${streak || 0} days`));
  document.querySelectorAll('[data-booking-count]').forEach((node) => (node.textContent = bookingCount));
  document.querySelectorAll('[data-journal-count]').forEach((node) => (node.textContent = journalCount));
};

const renderQuote = () => {
  document.querySelectorAll('[data-quote]').forEach((node) => (node.textContent = getQuoteOfDay()));
};

const renderMoodTimeline = () => {
  const container = document.getElementById('moodTimeline');
  if (!container) return;

  if (!state.moodEntries.length) {
    container.innerHTML = '<div class="data-empty">No mood entries yet. Capture today’s check-in to start your wellness timeline.</div>';
    return;
  }

  container.innerHTML = state.moodEntries
    .slice(0, 4)
    .map(
      (entry) => `
        <div class="timeline-item pb-6">
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="font-semibold capitalize">${entry.mood}</p>
              <p class="text-sm text-slate-500">Stress ${entry.stressLevel}/10 • Anxiety ${entry.anxietyLevel}/10 • Sleep ${entry.sleepHours}h</p>
            </div>
            <span class="text-sm text-slate-500">${formatDate(entry.createdAt || Date.now())}</span>
          </div>
          <p class="mt-2 text-sm text-slate-500">${entry.note || 'No note added for this check-in.'}</p>
        </div>
      `
    )
    .join('');
};

const renderJournalPreview = () => {
  const container = document.getElementById('journalPreview');
  if (!container) return;

  if (!state.journalEntries.length) {
    container.innerHTML = '<div class="data-empty">Private reflections will appear here once you write your first journal note.</div>';
    return;
  }

  container.innerHTML = state.journalEntries
    .slice(0, 3)
    .map(
      (note) => `
        <article class="rounded-3xl bg-white/60 p-5 theme-dark:bg-slate-950/30">
          <div class="mb-3 flex items-center justify-between gap-3">
            <h3 class="font-semibold">${note.title}</h3>
            <span class="mood-chip text-xs">${note.moodTag}</span>
          </div>
          <p class="text-sm text-slate-500">${note.content.slice(0, 120)}...</p>
        </article>
      `
    )
    .join('');
};

const renderBookings = (targetId = 'bookingList', items = state.bookings) => {
  const container = document.getElementById(targetId);
  if (!container) return;

  if (!items.length) {
    container.innerHTML = '<div class="data-empty">No appointments yet. Explore therapists and book your first session.</div>';
    return;
  }

  container.innerHTML = items
    .map((booking) => {
      const therapist = booking.therapistId || booking.therapist || {};
      return `
        <div class="rounded-[24px] border border-white/60 bg-white/70 p-5 shadow-sm">
          <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p class="text-lg font-semibold">${therapist.name || 'MindEase Therapist'}</p>
              <p class="text-sm text-slate-500">${formatDateTime(booking.date, booking.time)} • ${booking.mode}</p>
            </div>
            <span class="status-badge status-${booking.status || 'confirmed'}">${booking.status || 'confirmed'}</span>
          </div>
          <div class="mt-4 flex flex-wrap gap-3">
            <button class="btn-secondary text-sm" data-action="cancel-booking" data-id="${booking._id || booking.id}">Cancel</button>
            <button class="btn-primary text-sm" data-action="reschedule-booking" data-id="${booking._id || booking.id}">Reschedule</button>
          </div>
        </div>
      `;
    })
    .join('');
};

const renderTherapists = async () => {
  const container = document.getElementById('therapistGrid');
  if (!container) return;

  const result = await api.getTherapists().catch(() => ({ therapists: DEMO_THERAPISTS }));
  const therapists = result.therapists || DEMO_THERAPISTS;

  container.innerHTML = therapists
    .map(
      (therapist) => `
        <article class="glass well-card overflow-hidden p-4">
          <img src="${therapist.photo}" alt="${therapist.name}" class="therapist-image w-full" />
          <div class="p-2 pt-5">
            <div class="mb-3 flex items-start justify-between gap-4">
              <div>
                <h3 class="text-xl font-semibold">${therapist.name}</h3>
                <p class="text-sm text-slate-500">${therapist.specialization.join(' • ')}</p>
              </div>
              <span class="pill">⭐ ${therapist.rating}</span>
            </div>
            <p class="mb-4 text-sm text-slate-500">${therapist.bio}</p>
            <div class="mb-5 flex flex-wrap gap-2">
              <span class="mood-chip text-xs">${therapist.experience}+ years</span>
              <span class="mood-chip text-xs">$${therapist.fee}/session</span>
              <span class="mood-chip text-xs">${therapist.mode.join(' / ')}</span>
            </div>
            <div class="flex gap-3">
              <a href="./therapist-profile.html?id=${therapist._id}" class="btn-secondary flex-1 text-sm">View Profile</a>
              <button class="btn-primary flex-1 text-sm" data-book-therapist='${JSON.stringify(therapist)}'>Book Now</button>
            </div>
          </div>
        </article>
      `
    )
    .join('');
};

const renderResources = async () => {
  const container = document.getElementById('resourceGrid');
  if (!container) return;

  const result = await api.getResources().catch(() => ({ resources: DEMO_RESOURCES }));
  const resources = result.resources || DEMO_RESOURCES;

  container.innerHTML = resources
    .map(
      (resource) => `
        <article class="glass well-card overflow-hidden p-4">
          <img src="${resource.image}" alt="${resource.title}" class="resource-image w-full" />
          <div class="p-2 pt-5">
            <div class="mb-4 flex items-center justify-between gap-3">
              <span class="pill">${resource.category}</span>
              <span class="text-sm text-slate-500">Curated</span>
            </div>
            <h3 class="text-xl font-semibold">${resource.title}</h3>
            <p class="mt-3 text-sm text-slate-500">${resource.content}</p>
          </div>
        </article>
      `
    )
    .join('');
};

const bootstrapDemoData = () => {
  if (!state.moodEntries.length) {
    state.moodEntries = [
      {
        mood: 'calm',
        stressLevel: 4,
        anxietyLevel: 3,
        sleepHours: 7,
        note: 'Steady focus after a slower morning and short walk.',
        createdAt: new Date().toISOString()
      },
      {
        mood: 'overwhelmed',
        stressLevel: 8,
        anxietyLevel: 7,
        sleepHours: 5,
        note: 'Heavy workload today. Needed more breaks than expected.',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  }

  if (!state.journalEntries.length) {
    state.journalEntries = [
      {
        id: crypto.randomUUID(),
        title: 'Finding a gentler pace',
        content: 'I noticed that forcing productivity made everything louder. Slowing down helped me think more clearly.',
        moodTag: 'reflective',
        createdAt: new Date().toISOString()
      }
    ];
  }

  if (!state.bookings.length) {
    state.bookings = [
      {
        id: crypto.randomUUID(),
        therapist: DEMO_THERAPISTS[0],
        date: new Date(Date.now() + 3 * 86400000).toISOString(),
        time: '11:00 AM',
        mode: 'online',
        status: 'confirmed'
      }
    ];
  }

  if (!state.profile) {
    state.profile = {
      name: 'Sana Mehta',
      email: 'sana@example.com',
      age: 29,
      gender: 'Female',
      role: 'user',
      notificationPreferences: {
        emailReminders: true,
        dailyCheckIn: true,
        appointmentAlerts: true
      }
    };
  }

  saveLocal();
};

const bindThemeToggle = () => {
  document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      document.body.classList.toggle('theme-dark', state.theme === 'dark');
      saveLocal();
    });
  });
};

const bindBookingActions = () => {
  document.addEventListener('click', async (event) => {
    const cancelButton = event.target.closest('[data-action="cancel-booking"]');
    const rescheduleButton = event.target.closest('[data-action="reschedule-booking"]');
    const quickBook = event.target.closest('[data-book-therapist]');

    if (cancelButton) {
      const id = cancelButton.dataset.id;
      state.bookings = state.bookings.map((item) =>
        (item.id || item._id) === id ? { ...item, status: 'cancelled' } : item
      );
      saveLocal();
      renderBookings();
      notify('Appointment cancelled');
    }

    if (rescheduleButton) {
      const id = rescheduleButton.dataset.id;
      state.bookings = state.bookings.map((item) =>
        (item.id || item._id) === id
          ? { ...item, status: 'rescheduled', date: new Date(Date.now() + 5 * 86400000).toISOString(), time: '04:30 PM' }
          : item
      );
      saveLocal();
      renderBookings();
      notify('Appointment rescheduled for a later slot');
    }

    if (quickBook) {
      const therapist = JSON.parse(quickBook.dataset.bookTherapist);
      state.bookings.unshift({
        id: crypto.randomUUID(),
        therapist,
        date: new Date(Date.now() + 2 * 86400000).toISOString(),
        time: '12:00 PM',
        mode: therapist.mode[0],
        status: 'confirmed'
      });
      saveLocal();
      notify(`Session booked with ${therapist.name}`);
    }
  });
};

const bindAuthForms = () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const forgotForm = document.getElementById('forgotForm');

  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const payload = Object.fromEntries(new FormData(loginForm).entries());

      try {
        const data = await api.login(payload);
        localStorage.setItem('mindease_token', data.token);
        state.profile = data.user;
        saveLocal();
        window.location.href = './dashboard.html';
      } catch (error) {
        state.profile = { ...state.profile, email: payload.email };
        saveLocal();
        notify(error.message + ' Using local demo mode instead.', 'error');
        window.location.href = './dashboard.html';
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const payload = Object.fromEntries(new FormData(registerForm).entries());
      payload.age = Number(payload.age);

      try {
        const data = await api.register(payload);
        localStorage.setItem('mindease_token', data.token);
        state.profile = data.user;
        saveLocal();
      } catch (error) {
        state.profile = { ...payload, role: 'user' };
        saveLocal();
      }

      notify('Welcome to MindEase');
      window.location.href = './dashboard.html';
    });
  }

  if (forgotForm) {
    forgotForm.addEventListener('submit', (event) => {
      event.preventDefault();
      notify('Password reset link simulated for demo experience');
      forgotForm.reset();
    });
  }
};

const bindMoodForm = () => {
  const moodForm = document.getElementById('moodForm');
  if (!moodForm) return;

  moodForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(moodForm).entries());
    payload.stressLevel = Number(payload.stressLevel);
    payload.anxietyLevel = Number(payload.anxietyLevel);
    payload.sleepHours = Number(payload.sleepHours);
    payload.createdAt = new Date().toISOString();

    try {
      const data = await api.addMoodEntry(payload);
      state.moodEntries.unshift(data.entry);
    } catch (error) {
      state.moodEntries.unshift(payload);
    }

    saveLocal();
    renderMoodTimeline();
    renderStats();
    moodForm.reset();
    notify('Mood check-in saved');
  });
};

const bindJournalForm = () => {
  const journalForm = document.getElementById('journalForm');
  const searchForm = document.getElementById('journalSearchForm');
  const list = document.getElementById('journalList');
  if (!journalForm && !list) return;

  const paint = (items = state.journalEntries) => {
    if (!list) return;

    list.innerHTML = items.length
      ? items
          .map(
            (note) => `
              <article class="glass well-card p-5">
                <div class="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 class="text-lg font-semibold">${note.title}</h3>
                    <p class="text-sm text-slate-500">${formatDate(note.createdAt || Date.now())}</p>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="mood-chip text-xs">${note.moodTag}</span>
                    <button class="text-sm font-semibold text-rose-500" data-delete-note="${note.id || note._id}">Delete</button>
                  </div>
                </div>
                <p class="text-sm leading-7 text-slate-500">${note.content}</p>
              </article>
            `
          )
          .join('')
      : '<div class="data-empty">No journal entries yet. Write a private note to begin your reflection archive.</div>';
  };

  paint();

  if (journalForm) {
    journalForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const payload = Object.fromEntries(new FormData(journalForm).entries());
      payload.id = crypto.randomUUID();
      payload.createdAt = new Date().toISOString();

      try {
        const data = await api.addJournalEntry(payload);
        state.journalEntries.unshift(data.note);
      } catch (error) {
        state.journalEntries.unshift(payload);
      }

      saveLocal();
      paint();
      renderJournalPreview();
      renderStats();
      journalForm.reset();
      notify('Journal entry saved privately');
    });
  }

  if (searchForm) {
    searchForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const query = new FormData(searchForm).get('query').toLowerCase();
      const filtered = state.journalEntries.filter((item) =>
        [item.title, item.content, item.moodTag].some((field) => field.toLowerCase().includes(query))
      );
      paint(filtered);
    });
  }

  document.addEventListener('click', (event) => {
    const deleteButton = event.target.closest('[data-delete-note]');
    if (!deleteButton) return;
    const id = deleteButton.dataset.deleteNote;
    state.journalEntries = state.journalEntries.filter((note) => (note.id || note._id) !== id);
    saveLocal();
    paint();
    renderJournalPreview();
    renderStats();
    notify('Journal entry removed');
  });
};

const bindBookingForm = () => {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(form).entries());
    const therapist = DEMO_THERAPISTS.find((item) => item._id === payload.therapistId) || DEMO_THERAPISTS[0];

    try {
      const data = await api.createBooking(payload);
      state.bookings.unshift(data.booking);
    } catch (error) {
      state.bookings.unshift({
        id: crypto.randomUUID(),
        therapist,
        date: payload.date,
        time: payload.time,
        mode: payload.mode,
        status: 'confirmed'
      });
    }

    saveLocal();
    renderBookings();
    renderStats();
    form.reset();
    notify('Therapy session booked');
  });
};

const bindSettingsForm = () => {
  const profileForm = document.getElementById('profileForm');
  const passwordForm = document.getElementById('passwordForm');
  if (!profileForm && !passwordForm) return;

  if (profileForm) {
    if (state.profile) {
      Object.entries({
        name: state.profile.name,
        email: state.profile.email,
        age: state.profile.age,
        gender: state.profile.gender
      }).forEach(([key, value]) => {
        const input = profileForm.elements.namedItem(key);
        if (input && value !== undefined) input.value = value;
      });
    }

    profileForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const payload = Object.fromEntries(new FormData(profileForm).entries());
      payload.age = Number(payload.age);

      try {
        const data = await api.updateProfile(payload);
        state.profile = data.user;
      } catch (error) {
        state.profile = { ...state.profile, ...payload };
      }

      saveLocal();
      setGreeting();
      notify('Profile updated');
    });
  }

  if (passwordForm) {
    passwordForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const payload = Object.fromEntries(new FormData(passwordForm).entries());

      try {
        await api.changePassword(payload);
      } catch (error) {
        notify('Password updated in demo mode');
      }

      passwordForm.reset();
      notify('Password changed successfully');
    });
  }
};

const renderTherapistProfile = async () => {
  const root = document.getElementById('therapistProfile');
  if (!root) return;
  const therapistId = new URLSearchParams(window.location.search).get('id') || DEMO_THERAPISTS[0]._id;
  const { therapist } = await api.getTherapistById(therapistId);

  root.innerHTML = `
    <div class="grid gap-8 lg:grid-cols-[0.95fr,1.2fr]">
      <div class="glass well-card p-5">
        <img src="${therapist.photo}" alt="${therapist.name}" class="therapist-image w-full" />
      </div>
      <div class="glass well-card p-8">
        <div class="mb-5 flex flex-wrap items-center gap-3">
          <span class="pill">⭐ ${therapist.rating}</span>
          <span class="pill">${therapist.experience}+ years experience</span>
          <span class="pill">$${therapist.fee} / session</span>
        </div>
        <h1 class="font-display text-4xl font-semibold">${therapist.name}</h1>
        <p class="mt-3 text-lg text-slate-500">${therapist.specialization.join(' • ')}</p>
        <p class="mt-6 leading-8 text-slate-600">${therapist.bio}</p>
        <div class="mt-8 grid gap-4 md:grid-cols-2">
          ${(therapist.availability || []).map((slot) => `<div class="rounded-3xl bg-white/60 p-4"><p class="font-semibold">${slot.day}</p><p class="mt-2 text-sm text-slate-500">${slot.slots.join(', ')}</p></div>`).join('')}
        </div>
        <div class="mt-8 flex gap-3">
          <a href="./therapy-booking.html" class="btn-primary">Book Session</a>
          <a href="./appointments.html" class="btn-secondary">View Appointments</a>
        </div>
      </div>
    </div>
  `;
};

const initCharts = async () => {
  if (!window.Chart) return;

  const moodCanvas = document.getElementById('moodTrendChart');
  const stressCanvas = document.getElementById('stressChart');
  if (!moodCanvas && !stressCanvas) return;

  const labels = state.moodEntries
    .slice()
    .reverse()
    .map((item) => new Date(item.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }));

  const sharedOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#94a3b8' } } },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.1)' } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.1)' } }
    }
  };

  if (moodCanvas) {
    new Chart(moodCanvas, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Sleep Hours',
            data: state.moodEntries.slice().reverse().map((item) => item.sleepHours),
            borderColor: '#21b8a6',
            backgroundColor: 'rgba(33, 184, 166, 0.18)',
            fill: true,
            tension: 0.35
          },
          {
            label: 'Wellness Score',
            data: state.moodEntries.slice().reverse().map((item) => computeWellnessScore(item)),
            borderColor: '#7367f0',
            backgroundColor: 'rgba(115, 103, 240, 0.18)',
            fill: true,
            tension: 0.35
          }
        ]
      },
      options: sharedOptions
    });
  }

  if (stressCanvas) {
    new Chart(stressCanvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Stress',
            data: state.moodEntries.slice().reverse().map((item) => item.stressLevel),
            backgroundColor: '#ff7d6e',
            borderRadius: 18
          },
          {
            label: 'Anxiety',
            data: state.moodEntries.slice().reverse().map((item) => item.anxietyLevel),
            backgroundColor: '#7367f0',
            borderRadius: 18
          }
        ]
      },
      options: sharedOptions
    });
  }
};

const renderAdminPage = async () => {
  const metricsRoot = document.getElementById('adminMetrics');
  const usersRoot = document.getElementById('adminUsers');
  const bookingsRoot = document.getElementById('adminBookings');
  if (!metricsRoot) return;

  let analytics = { metrics: { users: 184, therapists: 32, bookings: 256, moodEntries: 1238, resources: 18, pendingTherapists: 4 } };
  let users = { users: [] };
  let bookings = { bookings: [] };

  try {
    [analytics, users, bookings] = await Promise.all([api.getAdminAnalytics(), api.getAdminUsers(), api.getAdminBookings()]);
  } catch (error) {
    users.users = [state.profile || { name: 'Sana Mehta', email: 'sana@example.com', role: 'user' }];
    bookings.bookings = state.bookings;
  }

  metricsRoot.innerHTML = Object.entries(analytics.metrics)
    .map(
      ([key, value]) => `
        <div class="metric-card">
          <p class="text-sm uppercase tracking-[0.2em] text-slate-500">${key.replace(/([A-Z])/g, ' $1')}</p>
          <p class="mt-3 text-3xl font-semibold">${value}</p>
        </div>
      `
    )
    .join('');

  usersRoot.innerHTML = (users.users || [])
    .map(
      (user) => `
        <div class="rounded-3xl bg-white/60 p-4">
          <p class="font-semibold">${user.name}</p>
          <p class="text-sm text-slate-500">${user.email}</p>
          <span class="mood-chip mt-3 text-xs">${user.role || 'user'}</span>
        </div>
      `
    )
    .join('');

  bookingsRoot.innerHTML = (bookings.bookings || [])
    .slice(0, 4)
    .map((booking) => {
      const therapist = booking.therapistId || booking.therapist || {};
      const user = booking.userId || state.profile || {};
      return `
        <div class="rounded-3xl bg-white/60 p-4">
          <p class="font-semibold">${therapist.name || 'Therapist Session'}</p>
          <p class="text-sm text-slate-500">${user.name || 'MindEase User'} • ${booking.mode || 'online'}</p>
          <span class="status-badge status-${booking.status || 'confirmed'} mt-3">${booking.status || 'confirmed'}</span>
        </div>
      `;
    })
    .join('');
};

const hydratePage = async () => {
  bootstrapDemoData();
  bindThemeToggle();
  bindBookingActions();
  bindAuthForms();
  bindMoodForm();
  bindJournalForm();
  bindBookingForm();
  bindSettingsForm();
  setGreeting();
  renderStats();
  renderQuote();
  renderMoodTimeline();
  renderJournalPreview();
  renderBookings();

  if (routePage === 'booking') await renderTherapists();
  if (routePage === 'resources') await renderResources();
  if (routePage === 'therapist-profile') await renderTherapistProfile();
  if (routePage === 'analytics' || routePage === 'dashboard') await initCharts();
  if (routePage === 'admin') await renderAdminPage();
};

hydratePage();
