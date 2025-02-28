
        async function sendOTP() {
            const email = document.getElementById('email').value;
            const res = await fetch('http://localhost:7000/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            if (res.ok) {
                document.getElementById('otpSection').style.display = 'block';
            }
        }

        async function verifyOTP() {
            const email = document.getElementById('email').value;
            const otp = document.getElementById('otp').value;
            const res = await fetch('http://localhost:7000/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            });
            const data = await res.json();
            alert(data.message);
        }
   