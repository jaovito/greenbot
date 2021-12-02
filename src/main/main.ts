/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import 'dotenv/config';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import Store from 'electron-store';
import { Cluster } from 'puppeteer-cluster';
import { PuppeteerNodeLaunchOptions } from 'puppeteer';

import { isAfter } from 'date-fns';
import { Buffer } from 'buffer';
import { createDecipheriv } from 'crypto';
import { api, apiNot } from '../services/api';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

const edgePaths = require('edge-paths');

const EDGE_PATH = edgePaths.getEdgePath();

type Hash = {
  iv: string;
  content: string;
};

function Decrypt(hash: Hash) {
  const decipher = createDecipheriv(
    'aes-256-ctr',
    'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3',
    Buffer.from(hash.iv, 'hex')
  );

  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(hash.content, 'hex')),
    decipher.final(),
  ]);

  return decrpyted.toString();
}

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
const store = new Store();

(async () => {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 2,
    timeout: 30000,
    puppeteerOptions: {
      executablePath: EDGE_PATH,
      slowMo: 60,
    } as PuppeteerNodeLaunchOptions,
  });

  const listCluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 2,
    timeout: 30000,
    puppeteerOptions: {
      executablePath: EDGE_PATH,
      slowMo: 20,
    } as PuppeteerNodeLaunchOptions,
  });

  await cluster.task(async ({ page, data }) => {
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'
    );
    await page.setDefaultNavigationTimeout(0);
    await page.setViewport({
      width: 900,
      height: 600,
    });

    const token = await store.get('@fut100:token');

    api.defaults.headers.common.authorization = `Bearer ${token}`;

    await page.goto(data.url, {
      waitUntil: 'networkidle2',
    });
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log('Iniciou');

    const inputLogin = '.lms-StandardLogin_Username ';
    const inputpassword = '.lms-StandardLogin_Password ';

    await page.click('div.hm-MainHeaderRHSLoggedOutMed_Login');
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log('Entrou');

    await page.type(inputLogin, data.bet_login);
    await page.type(inputpassword, data.bet_password);

    await page.click('.lms-LoginButton');

    await page.waitForNavigation();
    await new Promise((resolve) => setTimeout(resolve, 4000));

    console.log('Logou');

    const path1 = await page.$$(
      '.gl-Participant.gl-Participant_General.gl-Market_General-cn3'
    );
    const pathGols = await page.$$(
      '.gl-ParticipantOddsOnly.gl-Participant_General.gl-Market_General-cn1'
    );
    const pathBorderless = await page.$$(
      '.gl-ParticipantBorderless.gl-Participant_General.gl-Market_General-cn2'
    );
    const pathBorderless3 = await page.$$(
      '.gl-ParticipantBorderless.gl-Participant_General.gl-Market_General-cn3'
    );

    const pathCentered = await page.$$(
      '.gl-ParticipantCentered.gl-Participant_General.gl-Market_General-cn1'
    );

    switch (data.name) {
      case 'Resultado Final - Mandante':
        await path1[0].click();
        break;
      case 'Resultado Final - Empate':
        await path1[1].click();
        break;
      case 'Resultado Final - Visitante':
        await path1[2].click();
        break;
      case 'Dupla Hipótese - Mandante ou empate':
        await path1[3].click();
        break;
      case 'Dupla Hipótese - Empate ou visitante':
        await path1[4].click();
        break;
      case 'Dupla Hipótese - Mandante ou visitante':
        await path1[5].click();
        break;
      case 'Resultado Final - Preços Ajustados - Mandante ou empate':
        await path1[3].click();
        break;
      case 'Resultado Final - Preços Ajustados - Empate ou visitante':
        await path1[4].click();
        break;
      case 'Resultado Final - Preços Ajustados - Mandante ou visitante':
        await path1[5].click();
        break;
      case 'Dupla Hipótese 1 - Mandante ou empate':
        await path1[6].click();
        break;
      case 'Dupla Hipótese 1 - Empate ou visitante':
        await path1[7].click();
        break;
      case 'Dupla Hipótese 1 - Mandante ou visitante':
        await path1[8].click();
        break;
      case 'Gols Mais/Menos - Mais de':
        await pathGols[0].click();
        break;
      case 'Gols Mais/Menos - Menos de':
        await pathGols[1].click();
        break;
      case 'Para Ambos os Times Marcarem - Sim':
        await pathBorderless[0].click();
        break;
      case 'Para Ambos os Times Marcarem - Não':
        await pathBorderless[1].click();
        break;
      case 'Resultado/Para ambos os Times Marcarem - Mandante sim':
        await pathGols[2].click();
        break;
      case 'Resultado/Para ambos os Times Marcarem - Mandante não':
        await pathGols[5].click();
        break;
      case 'Resultado/Para ambos os Times Marcarem - Visitante sim':
        await pathGols[3].click();
        break;
      case 'Resultado/Para ambos os Times Marcarem - Visitante não':
        await pathGols[6].click();
        break;
      case 'Resultado/Para ambos os Times Marcarem - Empate sim':
        await pathGols[4].click();
        break;
      case 'Resultado/Para ambos os Times Marcarem - Empate não':
        await pathGols[7].click();
        break;
      case 'Intervalo/Final do Jogo - Mandante - Mandante':
        await pathBorderless3[0].click();
        break;
      case 'Intervalo/Final do Jogo - Mandante - Empate':
        await pathBorderless3[1].click();
        break;
      case 'Intervalo/Final do Jogo - Mandante - Visitante':
        await pathBorderless3[2].click();
        break;
      case 'Intervalo/Final do Jogo - Empate - Mandante':
        await pathBorderless3[3].click();
        break;
      case 'Intervalo/Final do Jogo - Empate - Empate':
        await pathBorderless3[4].click();
        break;
      case 'Intervalo/Final do Jogo - Empate - Visitante':
        await pathBorderless3[5].click();
        break;
      case 'Intervalo/Final do Jogo - Visitante - Mandante':
        await pathBorderless3[6].click();
        break;
      case 'Intervalo/Final do Jogo - Visitante - Empate':
        await pathBorderless3[7].click();
        break;
      case 'Intervalo/Final do Jogo - Visitante - Visitante':
        await pathBorderless3[8].click();
        break;
      case 'Marcadores de Gol - Opção 1 Primeiro':
        await pathGols[8].click();
        break;
      case 'Marcadores de Gol - Opção 1 Último':
        await pathGols[14].click();
        break;
      case 'Marcadores de Gol - Opção 1 A Qualquer Momento':
        await pathGols[20].click();
        break;
      case 'Marcadores de Gol - Opção 2 Primeiro':
        await pathGols[9].click();
        break;
      case 'Marcadores de Gol - Opção 2 Último':
        await pathGols[15].click();
        break;
      case 'Marcadores de Gol - Opção 2 A Qualquer Momento':
        await pathGols[21].click();
        break;
      case 'Marcadores de Gol - Opção 3 Primeiro':
        await pathGols[10].click();
        break;
      case 'Marcadores de Gol - Opção 3 Último':
        await pathGols[16].click();
        break;
      case 'Marcadores de Gol - Opção 3 A Qualquer Momento':
        await pathGols[22].click();
        break;
      case 'Marcadores de Gol - Opção 4 Primeiro':
        await pathGols[11].click();
        break;
      case 'Marcadores de Gol - Opção 4 Último':
        await pathGols[17].click();
        break;
      case 'Marcadores de Gol - Opção 4 A Qualquer Momento':
        await pathGols[23].click();
        break;
      case 'Marcadores de Gol - Opção 5 Primeiro':
        await pathGols[12].click();
        break;
      case 'Marcadores de Gol - Opção 5 Último':
        await pathGols[18].click();
        break;
      case 'Marcadores de Gol - Opção 5 A Qualquer Momento':
        await pathGols[24].click();
        break;
      case 'Marcadores de Gol - Opção 6 Primeiro':
        await pathGols[13].click();
        break;
      case 'Marcadores de Gol - Opção 6 Último':
        await pathGols[19].click();
        break;
      case 'Marcadores de Gol - Opção 6 A Qualquer Momento':
        await pathGols[25].click();
        break;
      case 'Gols +/- - Mais de':
        await pathGols[26].click();
        break;
      case 'Gols +/- - Menos de':
        await pathGols[27].click();
        break;
      case 'Escanteios - Mais de':
        await pathGols[28].click();
        break;
      case 'Escanteios - Exatamente':
        await pathGols[29].click();
        break;
      case 'Escanteios - Menos de':
        await pathGols[30].click();
        break;
      case 'Empate Anula Aposta - Mandante':
        await pathBorderless[4].click();
        break;
      case 'Empate Anula Aposta - Visitante':
        await pathBorderless[5].click();
        break;
      case 'Handicap Asiático - Mandante':
        await pathCentered[0].click();
        break;
      case 'Handicap Asiático - Visitante':
        await pathCentered[1].click();
        break;
      default:
      // do nothing
    }

    await new Promise((resolve) => setTimeout(resolve, 6000));

    await page.click('.qbs-StakeBox_StakeValue.qbs-StakeBox_StakeValue-input');
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await page.keyboard.type(data.value.toString(), { delay: 10 });
    console.log('Digitou');

    await new Promise((resolve) => setTimeout(resolve, 2000));

    await page.click('.qbs-PlaceBetButton_Wrapper');
    console.log('Apostou');

    await new Promise((resolve) => setTimeout(resolve, 2000));

    return 'ok';
  });

  await listCluster.task(async ({ page, data }) => {
    await page.setDefaultNavigationTimeout(0);
    await page.goto('https://www.bet365.com');
    console.log('Iniciou');
    const token = await store.get('@fut100:token');

    api.defaults.headers.common.authorization = `Bearer ${token}`;

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const inputLogin = '.lms-StandardLogin_Username ';
    const inputpassword = '.lms-StandardLogin_Password ';

    await page.click('div.hm-MainHeaderRHSLoggedOutMed_Login');
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await page.type(inputLogin, data.bet_login);
    await page.type(inputpassword, data.bet_password);
    await page.click('.lms-LoginButton');
    console.log('Logou');

    await new Promise((resolve) => setTimeout(resolve, 6000));

    await page.click('.hm-MainHeaderRHSLoggedInMed_MyBetsLabel ');
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log('Entrou em apostas');

    const button = await page.$$('.myb-HeaderButton ');
    await button[4].click();

    console.log('Selecionou todas apostas');

    await new Promise((resolve) => setTimeout(resolve, 6000));
    await page.click('.myb-SettledBetItemHeader');

    const divs = await page.$$eval('.myb-SettledBetItemHeader ', async (el) => {
      const infos = [];

      const promises = el.map(async (item: any) => {
        await item.click();

        let value = item.querySelector(
          '.myb-SettledBetItemHeader_Text'
        ).textContent;
        const name = item.querySelector(
          '.myb-SettledBetItemHeader_SubHeaderText'
        ).textContent;
        const result = item.querySelector(
          '.myb-SettledBetItem_BetStateContainer'
        ).textContent;
        value = value.split(' ')[0];
        value = value.replace('R$', '');
        value = value.replace(',', '.');
        value = Number(value);

        infos.push({ value, name, result });
      });

      Promise.all(promises);

      return infos;
    });

    console.log('Pegou todas');

    const promises = divs.map(async (div) => {
      const { name, value, result } = div;

      if (result === 'Perdida') {
        const bet = await api.post('bets', {
          name: name.trim(),
          value: Number(value),
          aposted: result,
          loose: String(value),
          userId: data.user.id,
        });

        const userLoose = data.user.looses;

        const looses = userLoose;

        if (isAfter(new Date(), new Date(looses.date))) {
          await api.put('bot', {
            stop: true,
            userId: data.user.id,
          });

          await api.put('looses', {
            date: new Date(),
            looses: Number(value),
            userId: data.user.id,
          });
        } else {
          await api.put('looses', {
            looses: Number(looses.looses) + Number(value),
            userId: data.user.id,
          });
        }

        return bet;
      }

      const bet = await api.post('bets', {
        name: name.trim(),
        value: Number(value),
        aposted: result,
        win: String(value),
        userId: data.user.id,
      });

      return bet;
    });

    const results = await Promise.all(promises);

    console.log('Salvou');

    return results;
  });

  ipcMain.on('replicate', async (_, replic) => {
    try {
      const token = await store.get('@fut100:token');

      api.defaults.headers.common.authorization = `Bearer ${token}`;

      const { data: users } = await api.get('users');

      const result = users.map(async (user: any) => {
        const password = JSON.parse(user.bet_password);

        if (
          user.bot_config &&
          user.looses &&
          Number(user.bot_config.stop_loss) > Number(user.looses.looses) &&
          user.bot_config.stop === false &&
          user.bet_password &&
          user.bet_login &&
          !isAfter(new Date(user.bot_config.updated_at), new Date())
        ) {
          const botConfig = user.bot_config;

          const decryptPassword = Decrypt(password);

          const results = await cluster
            .execute({
              url: replic.url,
              name: replic.name,
              value: botConfig.value,
              userId: user.id,
              bet_login: user.bet_login,
              bet_password: decryptPassword,
            })
            .catch((err) => console.log(err));

          return results;
        }

        return 'ok';
      });

      apiNot.defaults.headers.common.Authorization = `Basic YzdjZjA4YTgtMTQ3NC00MmExLWFlMDctNGM4M2QzNjRiN2Nl`;
      await Promise.all(result);

      await apiNot.post('notifications', {
        app_id: '8a436e39-7efe-4f1c-a465-3a20e66d899c',
        included_segments: ['Subscribed Users'],
        contents: {
          en: 'We replicate a bet for you',
          pt: 'Nós replicamos uma aposta para você',
        },
        headings: { en: 'Successful replicated', pt: 'Replicada com sucesso!' },
        small_icon: 'ic_stat_onesignal_default',
      });
    } catch (err) {
      console.log(err);
    }
  });

  ipcMain.on('list', async () => {
    try {
      const { data: users } = await api.get('users');

      const result = users.map(async (user: any) => {
        const password = JSON.parse(user.bet_password);

        const decryptPassword = Decrypt(password);

        const results = await listCluster
          .execute({
            userId: user.id,
            user,
            bet_login: user.bet_login,
            bet_password: decryptPassword,
          })
          .catch((err) => console.log(err));

        return results;
      });

      apiNot.defaults.headers.common.Authorization = `Basic YzdjZjA4YTgtMTQ3NC00MmExLWFlMDctNGM4M2QzNjRiN2Nl`;
      await Promise.all(result);
    } catch (err) {
      console.log(err);
    }
  });
})();

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.on('setUser', (_, user) => {
  store.set('@fut100:user', user);
});

ipcMain.on('setToken', (_, token) => {
  store.set('@fut100:token', token);
});

ipcMain.handle('getUser', async () => {
  const user = await store.get('@fut100:user');
  return user;
});

ipcMain.handle('getToken', async () => {
  const token = await store.get('@fut100:token');
  return token;
});

ipcMain.on('removeUser', () => {
  store.delete('@fut100:user');
});

ipcMain.on('removeToken', () => {
  store.delete('@fut100:token');
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(async () => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
