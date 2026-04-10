import { SlashCommandBuilder } from 'discord.js';
import { getHebrewDate, getHolidays, getHolidaysNext10Days, locationsList } from '../helper.js';

export default {
  data: new SlashCommandBuilder()
    .setName('information')
    .setDescription('Display information about the current Hebrew date and upcoming holidays.')
    .addStringOption(option =>
      option
        .setName('location')
        .setDescription('Select a location for holidays')
        .setRequired(false)
        .setAutocomplete(true)
    ),
  async execute(interaction) {
    const location = interaction.options.getString('location') || 'Jerusalem';
    
    const todayInHebrew = getHebrewDate().hebrewDateInHebrew;
    const todayInEnglish = getHebrewDate().hebrewDateInEnglish;
    const today = `Today is ${todayInHebrew} (${todayInEnglish})`;
    const holidays = getHolidays(location).holidaysToday;
    const holidaysAshki = getHolidays(location).holidaysTodayAshki;
    await interaction.reply(`${today} (${location})`);
    
    if (holidays && holidays.length > 0) {
        for (let i = 0; i < holidays.length; i++) {
            if (holidays[i] !== holidaysAshki[i]) {
                holidays[i] += ` (${holidaysAshki[i]})`;
            }
        }
      const holidayList = holidays.join('\n• ');
      await interaction.followUp(`For today:\n• ${holidayList}`);
    } else {
      await interaction.followUp('No holidays today.');
    }

    /* const holidaysNext10Days = getHolidaysNext10Days(location).holidaysToday;
    const holidaysNext10DaysAshki = getHolidaysNext10Days(location).holidaysTodayAshki;
    if (holidaysNext10Days && holidaysNext10Days.length > 0) {
        for (let i = 0; i < holidaysNext10Days.length; i++) {
            if (holidaysNext10Days[i] !== holidaysNext10DaysAshki[i]) {
                holidaysNext10Days[i] += ` (${holidaysNext10DaysAshki[i]})`;
            }
        }
        const holidayListNext10Days = holidaysNext10Days.join('\n• ');
        await interaction.followUp(`For the next 10 days:\n• ${holidayListNext10Days}`);
    } else {
        await interaction.followUp('No holidays in the next 10 days.');
    } */

  },
};
