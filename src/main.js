#! /usr/bin/env node
import FogControllerConfigService from './server/services/fogControllerConfigService';
import FogControllerConfigManager from './server/managers/fogControllerConfigManager';
import SatelliteManager from './server/managers/satelliteManager';
import UserManager from './server/managers/userManager';

import Server from './server';
import ConfigUtil from './server/utils/configUtil';
import constants from './server/constants.js';

function main() {
  let key,
    value,
    args = process.argv.slice(2);

  switch (args[0]) {
    case 'config':
      switch (args[1]) {
          case '-list':
            FogControllerConfigService.configList();
          break;

          case '-add':
            key = args[2];
            value = args[3];
            try {
              if(key && value){
              ConfigUtil.setConfigParam(key, value);
              console.log('Property "' + key + '" has been updated successfully.');
              }else{
                console.log('\nPlease provide values in following order:\n fog-controller config -add <key> <value>');
              }
            } catch (exception) {
              console.log(exception);
            }
            break;
          
          case '-remove':
            key = args[2];
              try {
                if(key){
                  FogControllerConfigManager.deleteConfig(key);
                }else{
                  console.log('\nPlease provide values in following order:\n fog-controller config -remove <key>');
                }
              } catch (exception) {
              console.log(exception);
            }
            break;
          default:
            console.log('Invalid flag "' + args[1] + '"');
      }
      break;

    case 'help':
      var helpString = "\tUsage 1: fog-controller [OPTION]\n" + 
                       "\tUsage 2: fog-controller [COMMAND] <Argument>\n" + 
                       "\tUsage 3: fog-controller [COMMAND] <key> <value>\n" + 
                       "\n\n" + 

        "\tCommand          Arguments                                           Meaning\n" + 
        "\t=======          =========                                           =======\n" + 
        "\tconfig           -list                                               Displays Configuration information in CLI (config table content)\n" +
        "\t                 -add <key> <value>                                  Set Configurations of fog-controller\n" +
        "\t                                                                     (You can set one of these configurations: PORT, SSL_KEY, INTERMEDIATE_CERT,  SSL_CERT)\n" +

        "\t                 -remove <key>                                       Deletes a Configuration with corresponding Key\n" +
        "\n\thelp                                                                 Shows this message\n" + 
        "\n\tsatellite        -list                                               List down all satellites\n" +
        "\t                 -add <name> <domain> <publicIP>                     Creates a new satellite\n" +
        "\t                 -remove <ID>                                        Deletes a satellite with corresponding ID\n" +
        "\n\tstart                                                                Starts fog-controller\n"+
        "\n\tuser             -list                                               List down all users\n" +
        "\t                 -add <email> <firstName> <lastName>                 Creates a new user\n" +
        "\t                 -remove <email>                                     Deletes a user with corresponding email\n" +
        "\t                 -generateToken <email>                              Resets User Access Token of corresponding email\n" +
        "\n\n" + 
        "\tReport bugs to: bugs@iotracks.com\n" + 
        "\tioFog home page: http://iofog.com\n" +
        "\tFor users with Eclipse accounts, report bugs to: https://bugs.eclipse.org/bugs/enter_bug.cgi?product=iofog";
        console.log(helpString);
        break;

    case 'start':
      console.log("Starting Fog Controller ...");
      Server.startServer(args[1]);
      break;

    case 'user':
      if (args[1]) {
        switch (args[1]) {
          case '-list':
            UserManager.list();
            break;
          case '-add':
            UserManager.createUser(args[2], args[3], args[4]);
            break;
          case '-remove':
            UserManager.removeUser(args[2]);
            break;
          case '-generateToken':
            UserManager.generateToken(args[2]);
            break;
          default:
            console.log('Invalid flag "' + args[1] + '"');
        }
      } else {
        UserManager.list();
      }
      break;

    case 'satellite':
      if (args[1]) {
        switch (args[1]) {
          case '-list':
            SatelliteManager.list();
            break;
          case '-add':
            SatelliteManager.createSatellite(args[2], args[3], args[4]);
            break;
          case '-remove':
            SatelliteManager.removeSatellite(args[2]);
            break;
          default:
            console.log('Invalid flag "' + args[1] + '"');
        }
      } else {
        SatelliteManager.list();
      }
      break;
   
    default:
      console.log('\nInvalid command "' + args[0] + '"');
  }
}

main();