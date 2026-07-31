# Guia de Build Local no Lubuntu (Wear OS / Android)

Este guia explica como compilar o APK do **Omnitrix (Wear OS)** na mesma VM Lubuntu já usada para o `os-guri-app`.

> Diferente do `os-guri-app` (Expo/React Native), este projeto é um **app Android nativo puro**
> (WebView + Kotlin + Gradle). Não usa Node, npm, Expo nem EAS — só reaproveita o **JDK 17** e o
> **Android SDK** que já estão instalados na VM.

---

## 1. Pré-requisitos (já devem estar prontos na VM)

Se a VM já foi configurada com o `LUBUNTU_SETUP_BUILD.md` do `os-guri-app`, os itens abaixo já existem:

- **JDK 17** (`sudo apt install -y openjdk-17-jdk`)
- **Android SDK** com `ANDROID_HOME` apontando para `$HOME/Android/Sdk` (variáveis no `~/.bashrc`)
- `platform-tools` e `cmdline-tools/latest` no `PATH`

Confirme antes de continuar:
```bash
java -version        # deve mostrar 17.x
echo $ANDROID_HOME    # não pode estar vazio
sdkmanager --list_installed | grep -E "platforms;android-34|build-tools"
```

Se faltar a platform 34 ou build-tools, instale:
```bash
sdkmanager "platforms;android-34" "build-tools;34.0.0"
yes | sdkmanager --licenses
```

---

## 2. Levar o projeto para a VM

Copie/clone o repositório `omnitrix-tizen-wearable` para a VM (via `git clone`, `git pull`, ou compartilhamento de pasta), e entre na pasta `android/`:

```bash
cd ~/projetos/omnitrix-tizen-wearable/android
chmod +x gradlew
```

O Gradle Wrapper (`gradlew`, `gradlew.bat`, `gradle/wrapper/gradle-wrapper.jar`) já vem no repositório —
não precisa de Android Studio nem de baixar Gradle manualmente.

---

## 3. Gerar o APK

### 3.1 APK de debug (para instalar e testar no relógio)
```bash
./gradlew assembleDebug
```
O arquivo gerado fica em:
```
app/build/outputs/apk/debug/app-debug.apk
```

### 3.2 APK/Bundle de release (sem assinatura própria ainda)
```bash
./gradlew assembleRelease      # gera .apk
./gradlew bundleRelease        # gera .aab (formato exigido pela Play Store)
```
> Por padrão o build de release usa a assinatura de debug do Android (não é válido para publicar
> na Play Store). Para gerar uma release assinada de verdade, é preciso criar um keystore
> (`keytool -genkey -v -keystore omnitrix.keystore ...`) e configurar `signingConfigs` no
> `app/build.gradle` — nesse caso me avise que eu ajusto o `build.gradle` para isso.

### 3.3 Se o build travar por falta de memória (OOM)
Assim como no `os-guri-app`, limite os workers do Gradle criando/editando `android/gradle.properties`:
```properties
org.gradle.workers.max=2
org.gradle.parallel=false
```

---

## 4. Instalar no relógio

Com o Wear OS em modo desenvolvedor + depuração Wi-Fi ativada (`Configurações > Sobre > tocar 7x no
número da versão`, depois `Opções do desenvolvedor > Depuração ADB via Wi-Fi`):

```bash
adb connect <ip-do-relogio>:5555
adb install app/build/outputs/apk/debug/app-debug.apk
```

---

## 5. Diferenças em relação ao `os-guri-app`

| | os-guri-app | omnitrix (Wear OS) |
|---|---|---|
| Framework | Expo / React Native | Android nativo (Kotlin + WebView) |
| Build tool | `eas-cli` / `expo` | `gradlew` (Gradle puro) |
| Precisa de Node/npm? | Sim | Não |
| Build em nuvem disponível? | Sim (`eas build`) | Não — só local via `gradlew` (ou Android Studio) |
| iOS | Sim, via EAS | Não se aplica (Wear OS é Android) |
