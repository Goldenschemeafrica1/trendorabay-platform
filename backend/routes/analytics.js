import express from 'express';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import auth from '../middleware/auth.js';

const router = express.Router();

// Initialize Google Analytics Data API client
const analyticsDataClient = new BetaAnalyticsDataClient();

// Helper function to get property ID from environment
const getPropertyId = () => {
  return process.env.GA_PROPERTY_ID;
};

// Helper function to format date range
const formatDateRange = (days = 30) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0]
  };
};

// GET /api/analytics/summary - Analytics Summary (page views, unique visitors, avg time on page)
router.get('/summary', auth, async (req, res, next) => {
  try {
    const propertyId = getPropertyId();
    if (!propertyId) {
      return res.status(500).json({ 
        success: false, 
        error: 'GA_PROPERTY_ID not configured' 
      });
    }

    const days = parseInt(req.query.days) || 30;
    const dateRange = formatDateRange(days);

    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [dateRange],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'activeUsers' },
        { name: 'averageSessionDuration' }
      ]
    });

    const summary = {
      period: `${days} days`,
      pageViews: 0,
      uniqueVisitors: 0,
      averageTimeOnPage: 0
    };

    if (response.rows) {
      response.rows.forEach(row => {
        summary.pageViews += parseInt(row.metricValues[0].value) || 0;
        summary.uniqueVisitors += parseInt(row.metricValues[1].value) || 0;
        summary.averageTimeOnPage += parseFloat(row.metricValues[2].value) || 0;
      });
    }

    // Convert average time from seconds to minutes
    summary.averageTimeOnPage = Math.round(summary.averageTimeOnPage / 60);

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Analytics summary error:', error);
    next(error);
  }
});

// GET /api/analytics/traffic-sources - Traffic Sources breakdown
router.get('/traffic-sources', auth, async (req, res, next) => {
  try {
    const propertyId = getPropertyId();
    if (!propertyId) {
      return res.status(500).json({ 
        success: false, 
        error: 'GA_PROPERTY_ID not configured' 
      });
    }

    const days = parseInt(req.query.days) || 30;
    const dateRange = formatDateRange(days);

    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [dateRange],
      dimensions: [
        { name: 'sessionDefaultChannelGroup' }
      ],
      metrics: [
        { name: 'sessions' }
      ],
      orderBys: [
        { metric: { metricName: 'sessions' }, desc: true }
      ]
    });

    const trafficSources = [];
    const totalSessions = response.rows?.reduce((sum, row) => 
      sum + parseInt(row.metricValues[0].value), 0) || 0;

    if (response.rows) {
      response.rows.forEach(row => {
        const source = row.dimensionValues[0].value || 'Direct';
        const sessions = parseInt(row.metricValues[0].value) || 0;
        trafficSources.push({
          source,
          sessions,
          percentage: totalSessions > 0 ? ((sessions / totalSessions) * 100).toFixed(1) : 0
        });
      });
    }

    res.json({
      success: true,
      data: {
        period: `${days} days`,
        totalSessions,
        trafficSources
      }
    });
  } catch (error) {
    console.error('Traffic sources error:', error);
    next(error);
  }
});

// GET /api/analytics/devices - Device types distribution
router.get('/devices', auth, async (req, res, next) => {
  try {
    const propertyId = getPropertyId();
    if (!propertyId) {
      return res.status(500).json({ 
        success: false, 
        error: 'GA_PROPERTY_ID not configured' 
      });
    }

    const days = parseInt(req.query.days) || 30;
    const dateRange = formatDateRange(days);

    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [dateRange],
      dimensions: [
        { name: 'deviceCategory' }
      ],
      metrics: [
        { name: 'sessions' }
      ],
      orderBys: [
        { metric: { metricName: 'sessions' }, desc: true }
      ]
    });

    const devices = [];
    const totalSessions = response.rows?.reduce((sum, row) => 
      sum + parseInt(row.metricValues[0].value), 0) || 0;

    if (response.rows) {
      response.rows.forEach(row => {
        const device = row.dimensionValues[0].value || 'Unknown';
        const sessions = parseInt(row.metricValues[0].value) || 0;
        devices.push({
          device,
          sessions,
          percentage: totalSessions > 0 ? ((sessions / totalSessions) * 100).toFixed(1) : 0
        });
      });
    }

    res.json({
      success: true,
      data: {
        period: `${days} days`,
        totalSessions,
        devices
      }
    });
  } catch (error) {
    console.error('Devices error:', error);
    next(error);
  }
});

// GET /api/analytics/countries - Geographic distribution
router.get('/countries', auth, async (req, res, next) => {
  try {
    const propertyId = getPropertyId();
    if (!propertyId) {
      return res.status(500).json({ 
        success: false, 
        error: 'GA_PROPERTY_ID not configured' 
      });
    }

    const days = parseInt(req.query.days) || 30;
    const limit = parseInt(req.query.limit) || 20;
    const dateRange = formatDateRange(days);

    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [dateRange],
      dimensions: [
        { name: 'country' }
      ],
      metrics: [
        { name: 'activeUsers' }
      ],
      orderBys: [
        { metric: { metricName: 'activeUsers' }, desc: true }
      ],
      limit: limit
    });

    const countries = [];
    const totalUsers = response.rows?.reduce((sum, row) => 
      sum + parseInt(row.metricValues[0].value), 0) || 0;

    if (response.rows) {
      response.rows.forEach(row => {
        const country = row.dimensionValues[0].value || 'Unknown';
        const users = parseInt(row.metricValues[0].value) || 0;
        countries.push({
          country,
          users,
          percentage: totalUsers > 0 ? ((users / totalUsers) * 100).toFixed(1) : 0
        });
      });
    }

    res.json({
      success: true,
      data: {
        period: `${days} days`,
        totalUsers,
        countries
      }
    });
  } catch (error) {
    console.error('Countries error:', error);
    next(error);
  }
});

// GET /api/analytics/dashboard - Combined dashboard data
router.get('/dashboard', auth, async (req, res, next) => {
  try {
    const propertyId = getPropertyId();
    if (!propertyId) {
      return res.status(500).json({ 
        success: false, 
        error: 'GA_PROPERTY_ID not configured' 
      });
    }

    const days = parseInt(req.query.days) || 30;
    const dateRange = formatDateRange(days);

    // Run all queries in parallel
    const [summaryResponse, trafficResponse, deviceResponse, countryResponse] = await Promise.all([
      analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [dateRange],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'activeUsers' },
          { name: 'averageSessionDuration' }
        ]
      }),
      analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [dateRange],
        dimensions: [{ name: 'sessionDefaultChannelGroup' }],
        metrics: [{ name: 'sessions' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }]
      }),
      analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [dateRange],
        dimensions: [{ name: 'deviceCategory' }],
        metrics: [{ name: 'sessions' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }]
      }),
      analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [dateRange],
        dimensions: [{ name: 'country' }],
        metrics: [{ name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
        limit: 10
      })
    ]);

    // Process summary
    const summary = {
      period: `${days} days`,
      pageViews: 0,
      uniqueVisitors: 0,
      averageTimeOnPage: 0
    };
    if (summaryResponse.rows) {
      summaryResponse.rows.forEach(row => {
        summary.pageViews += parseInt(row.metricValues[0].value) || 0;
        summary.uniqueVisitors += parseInt(row.metricValues[1].value) || 0;
        summary.averageTimeOnPage += parseFloat(row.metricValues[2].value) || 0;
      });
    }
    summary.averageTimeOnPage = Math.round(summary.averageTimeOnPage / 60);

    // Process traffic sources
    const trafficSources = [];
    const totalSessions = trafficResponse.rows?.reduce((sum, row) => 
      sum + parseInt(row.metricValues[0].value), 0) || 0;
    if (trafficResponse.rows) {
      trafficResponse.rows.forEach(row => {
        const source = row.dimensionValues[0].value || 'Direct';
        const sessions = parseInt(row.metricValues[0].value) || 0;
        trafficSources.push({
          source,
          sessions,
          percentage: totalSessions > 0 ? ((sessions / totalSessions) * 100).toFixed(1) : 0
        });
      });
    }

    // Process devices
    const devices = [];
    const totalDeviceSessions = deviceResponse.rows?.reduce((sum, row) => 
      sum + parseInt(row.metricValues[0].value), 0) || 0;
    if (deviceResponse.rows) {
      deviceResponse.rows.forEach(row => {
        const device = row.dimensionValues[0].value || 'Unknown';
        const sessions = parseInt(row.metricValues[0].value) || 0;
        devices.push({
          device,
          sessions,
          percentage: totalDeviceSessions > 0 ? ((sessions / totalDeviceSessions) * 100).toFixed(1) : 0
        });
      });
    }

    // Process countries
    const countries = [];
    const totalUsers = countryResponse.rows?.reduce((sum, row) => 
      sum + parseInt(row.metricValues[0].value), 0) || 0;
    if (countryResponse.rows) {
      countryResponse.rows.forEach(row => {
        const country = row.dimensionValues[0].value || 'Unknown';
        const users = parseInt(row.metricValues[0].value) || 0;
        countries.push({
          country,
          users,
          percentage: totalUsers > 0 ? ((users / totalUsers) * 100).toFixed(1) : 0
        });
      });
    }

    res.json({
      success: true,
      data: {
        summary,
        trafficSources: {
          totalSessions,
          sources: trafficSources
        },
        devices: {
          totalSessions: totalDeviceSessions,
          distribution: devices
        },
        countries: {
          totalUsers,
          distribution: countries
        }
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    next(error);
  }
});

export default router;
