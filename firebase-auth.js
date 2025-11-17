// firebase-auth.js
// Adds Firebase signup/login handling without modifying your existing script.js

(function () {
  const auth = window._FM?.auth;
  const storage = window._FM?.storage;
  const firestore = window._FM?.firestore;

  if (!auth) {
    console.warn("Firebase Auth not initialized. Did you include firebase-init.js?");
    return;
  }

  function consumeEvent(e) {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    if (e && typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();
  }

  const signupForm = document.querySelector('.auth-panel--signup .auth-form');
  const loginForm = document.querySelector('.auth-panel--login .auth-form');
  const avatarInput = document.getElementById('avatarInput');
  const signupCityEl = document.getElementById('signupCity');

  function getSignupFields(form) {
    if (!form) return {};
    return {
      name: form.querySelector('input[placeholder="Enter your full name"]')?.value.trim() || "",
      email: form.querySelector('input[type="email"]')?.value.trim() || "",
      phone: form.querySelector('input[type="tel"]')?.value.trim() || "",
      password: (function() {
        const pws = form.querySelectorAll('input[type="password"]');
        return pws.length ? pws[0].value : "";
      })(),
      city: signupCityEl?.value || ""
    };
  }

  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      consumeEvent(e);
      const { name, email, phone, password, city } = getSignupFields(signupForm);
      if (!email || !password) {
        alert("Please enter email and password.");
        return;
      }
      try {
        const userCred = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCred.user;

        // upload avatar if provided
        let photoURL = "";
        if (avatarInput && avatarInput.files && avatarInput.files.length > 0 && storage) {
          const file = avatarInput.files[0];
          const ref = storage.ref().child(`avatars/${user.uid}/${file.name}`);
          await ref.put(file);
          photoURL = await ref.getDownloadURL();
        }

        // update profile
        await user.updateProfile({
          displayName: name || null,
          photoURL: photoURL || null
        });

        // store extra metadata in Firestore (optional)
        if (firestore) {
          await firestore.collection('users').doc(user.uid).set({
            name: name || null,
            email: email,
            phone: phone || null,
            city: city || null,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        }

        // keep a local copy so existing account-page code works
        const localUser = { name, email, phone, city, uid: user.uid };
        localStorage.setItem("nagarMitrUser", JSON.stringify(localUser));

        window.location.href = "account.html";
      } catch (err) {
        console.error("Sign up error", err);
        alert(err.message || "Sign up failed.");
      }
    }, { capture: true });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      consumeEvent(e);
      const email = loginForm.querySelector('input[type="email"]')?.value.trim() || "";
      const password = loginForm.querySelector('input[type="password"]')?.value || "";

      if (!email || !password) {
        alert("Please enter email and password.");
        return;
      }

      try {
        const userCred = await auth.signInWithEmailAndPassword(email, password);
        const user = userCred.user;

        // attempt to read extra stored fields from Firestore
        let stored = { name: user.displayName || "", email: user.email || "", phone: "", city: "" };
        if (firestore) {
          try {
            const doc = await firestore.collection('users').doc(user.uid).get();
            if (doc.exists) stored = { ...stored, ...(doc.data() || {}) };
          } catch (e) {
            console.warn("Could not read Firestore user doc", e);
          }
        }

        const localUser = {
          name: stored.name || user.displayName || "",
          email: user.email || "",
          phone: stored.phone || "",
          city: stored.city || "",
          uid: user.uid
        };
        localStorage.setItem("nagarMitrUser", JSON.stringify(localUser));

        window.location.href = "account.html";
      } catch (err) {
        console.error("Login error", err);
        alert(err.message || "Login failed.");
      }
    }, { capture: true });
  }

  // keep localStorage synced when user returns with active session
  auth.onAuthStateChanged(async (user) => {
    if (!user) return;
    try {
      let stored = { name: user.displayName || "", email: user.email || "", phone: "", city: "" };
      if (firestore) {
        const doc = await firestore.collection('users').doc(user.uid).get();
        if (doc.exists) stored = { ...stored, ...(doc.data() || {}) };
      }
      const localUser = {
        name: stored.name || user.displayName || "",
        email: user.email || "",
        phone: stored.phone || "",
        city: stored.city || "",
        uid: user.uid
      };
      localStorage.setItem("nagarMitrUser", JSON.stringify(localUser));
    } catch (e) {
      console.warn("Auth state sync failed", e);
    }
  });

})();
