// Simple test to verify the news service works
const { fetchEarthquakeNews } = require('./src/services/newsServiceClient.ts');

async function testNews() {
  try {
    console.log('Testing news service...');
    const news = await fetchEarthquakeNews();
    console.log(`✅ Successfully fetched ${news.length} news articles`);
    
    if (news.length > 0) {
      console.log('\nFirst article:');
      console.log('Title:', news[0].title);
      console.log('Source:', news[0].source.name);
      console.log('Type:', news[0].type);
      console.log('Published:', news[0].publishedAt);
    }
  } catch (error) {
    console.error('❌ Error testing news service:', error.message);
  }
}

testNews();