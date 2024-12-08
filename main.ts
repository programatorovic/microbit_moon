//% weight=100 color=#0fbc11 icon="\uf1ec"
//% block="Moon"
namespace Moon {
    //% block="urči polohu mesiaca rok $year mesiac $month deň $day hodina $hour minúta $minute sekunda $second GPS [$latitude, $longitude]"
    //% year.min=2020 year.max=2100 month.min=1 month.max=12 day.min=1 day.max=31
    //% hour.min=0 hour.max=23 minute.min=0 minute.max=59 second.min=0 second.max=59
    //% latitude.min=-90 latitude.max=90 longitude.min=-180 longitude.max=180
    export function locateMoon(year: number, month: number, day: number, hour: number, minute: number, second: number, latitude: number, longitude: number): void {
        // Výpočet polohy mesiaca
        // Použitie základných astronomických algoritmov pre výpočet polohy mesiaca (zjednodušený príklad)
        let JD = 367 * year - Math.floor((7 * (year + Math.floor((month + 9) / 12))) / 4) + Math.floor((275 * month) / 9) + day + 1721013.5 + ((second / 60 + minute) / 60 + hour) / 24;
        let T = (JD - 2451545.0) / 36525;
        let L0 = 280.4665 + 36000.7698 * T;
        let L = (218.3165 + 481267.8813 * T) % 360;
        let M = (357.5291 + 35999.0503 * T) % 360;
        let lambda = L + 6.289 * Math.sin((M * Math.PI) / 180);
        let beta = 5.128 * Math.sin((L * Math.PI) / 180);

        // Získanie azimutu a výšky mesiaca
        let HA = ((hour + minute / 60 + second / 3600) * 15 - longitude - lambda) % 360;
        let altitude = Math.asin(Math.sin((latitude * Math.PI) / 180) * Math.sin((beta * Math.PI) / 180) + Math.cos((latitude * Math.PI) / 180) * Math.cos((beta * Math.PI) / 180) * Math.cos((HA * Math.PI) / 180)) * (180 / Math.PI);
        let azimuth = Math.atan2(-Math.sin((HA * Math.PI) / 180), Math.tan((latitude * Math.PI) / 180) * Math.cos((beta * Math.PI) / 180) - Math.sin((beta * Math.PI) / 180) * Math.cos((HA * Math.PI) / 180)) * (180 / Math.PI);
        if (azimuth < 0) azimuth += 360;

        // Navigácia pomocou kompasu a akcelerometra
        let targetAzimuth = azimuth;
        while (true) {
            let currentAzimuth = input.compassHeading();
            if (Math.abs(currentAzimuth - targetAzimuth) < 10) {
                break;
            } else if (currentAzimuth < targetAzimuth) {
                basic.showArrow(ArrowNames.East);
            } else {
                basic.showArrow(ArrowNames.West);
            }
            basic.pause(100);
        }

        for (let i = 0; i < 5; i++) {
            basic.pause(200);
            basic.showIcon(IconNames.SmallDiamond);
            basic.pause(200);
            basic.clearScreen();
        }

        while (true) {
            let tiltX = input.acceleration(Dimension.X);
            let tiltY = input.acceleration(Dimension.Y);
            if (tiltX > 200) {
                basic.showArrow(ArrowNames.West);
            } else if (tiltX < -200) {
                basic.showArrow(ArrowNames.East);
            } else if (tiltY > 200) {
                basic.showArrow(ArrowNames.North);
            } else if (tiltY < -200) {
                basic.showArrow(ArrowNames.South);
            } else {
                basic.showIcon(IconNames.No);
            }

            if (Math.abs(tiltX) < 200 && Math.abs(tiltY) < 200) {
                break;
            }
        }

        for (let i = 0; i < 8; i++) {
            basic.showIcon(IconNames.Target);
            music.playTone(Note.C, music.beat(BeatFraction.Eighth));
            basic.pause(100);
            basic.clearScreen();
            basic.pause(100);
        }
    }
}
