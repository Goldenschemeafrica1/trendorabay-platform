import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import magazineService from '../../services/magazineService';
import {
  setMagazines,
  setFeaturedMagazines,
  setCurrentMagazine,
  setCategories,
  setSubscriptions,
  updateFilters,
  resetFilters,
  setCurrentPage,
  setLoading,
  setError,
  clearError,
  clearCurrentMagazine,
  selectMagazines,
  selectFeaturedMagazines,
  selectCurrentMagazine,
  selectMagazineCategories,
  selectMagazineSubscriptions,
  selectMagazineFilters,
  selectMagazinePagination,
  selectMagazineLoading,
  selectMagazineError,
} from '../slices/magazineSlice';

export const useMagazines = () => {
  const dispatch = useDispatch();
  const magazines = useSelector(selectMagazines);
  const featuredMagazines = useSelector(selectFeaturedMagazines);
  const currentMagazine = useSelector(selectCurrentMagazine);
  const categories = useSelector(selectMagazineCategories);
  const subscriptions = useSelector(selectMagazineSubscriptions);
  const filters = useSelector(selectMagazineFilters);
  const pagination = useSelector(selectMagazinePagination);
  const isLoading = useSelector(selectMagazineLoading);
  const error = useSelector(selectMagazineError);

  // Fetch magazines
  const fetchMagazines = useCallback(async (page = 1, newFilters = {}) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());
      
      const response = await magazineService.getMagazines({
        ...filters,
        ...newFilters,
        page,
      });
      
      dispatch(setMagazines(response));
    } catch (error) {
      dispatch(setError(error.message || 'Failed to fetch magazines'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, filters]);

  // Fetch featured magazines
  const fetchFeaturedMagazines = useCallback(async (limit = 6) => {
    try {
      dispatch(setLoading(true));
      const response = await magazineService.getFeaturedMagazines(limit);
      dispatch(setFeaturedMagazines(response));
    } catch (error) {
      dispatch(setError(error.message || 'Failed to fetch featured magazines'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Fetch magazine by ID
  const fetchMagazineById = useCallback(async (id) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());
      
      const response = await magazineService.getMagazineById(id);
      dispatch(setCurrentMagazine(response));
      
      return response;
    } catch (error) {
      dispatch(setError(error.message || 'Failed to fetch magazine'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Fetch magazines by category
  const fetchMagazinesByCategory = useCallback(async (category, page = 1) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());
      
      const response = await magazineService.getMagazinesByCategory(category, page);
      dispatch(setMagazines(response));
      
      return response;
    } catch (error) {
      dispatch(setError(error.message || 'Failed to fetch magazines by category'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Search magazines
  const searchMagazines = useCallback(async (query, page = 1) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());
      
      const response = await magazineService.searchMagazines(query, page);
      dispatch(setMagazines(response));
      
      return response;
    } catch (error) {
      dispatch(setError(error.message || 'Failed to search magazines'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await magazineService.getCategories();
      dispatch(setCategories(response));
      
      return response;
    } catch (error) {
      dispatch(setError(error.message || 'Failed to fetch categories'));
      throw error;
    }
  }, [dispatch]);

  // Fetch subscription options
  const fetchSubscriptions = useCallback(async () => {
    try {
      const response = await magazineService.getSubscriptionOptions();
      dispatch(setSubscriptions(response));
      
      return response;
    } catch (error) {
      dispatch(setError(error.message || 'Failed to fetch subscriptions'));
      throw error;
    }
  }, [dispatch]);

  // Update filters
  const updateMagazineFilters = useCallback((newFilters) => {
    dispatch(updateFilters(newFilters));
  }, [dispatch]);

  // Reset filters
  const resetMagazineFilters = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  // Change page
  const changePage = useCallback((page) => {
    dispatch(setCurrentPage(page));
    fetchMagazines(page);
  }, [dispatch, fetchMagazines]);

  // Clear current magazine
  const clearMagazine = useCallback(() => {
    dispatch(clearCurrentMagazine());
  }, [dispatch]);

  return {
    // State
    magazines,
    featuredMagazines,
    currentMagazine,
    categories,
    subscriptions,
    filters,
    pagination,
    isLoading,
    error,

    // Actions
    fetchMagazines,
    fetchFeaturedMagazines,
    fetchMagazineById,
    fetchMagazinesByCategory,
    searchMagazines,
    fetchCategories,
    fetchSubscriptions,
    updateMagazineFilters,
    resetMagazineFilters,
    changePage,
    clearMagazine,
  };
};

export default useMagazines;
