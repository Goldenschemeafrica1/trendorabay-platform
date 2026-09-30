import React from 'react';
import { 
  Eye, EyeOff, CheckCircle, AlertCircle, User, Mail, Lock, 
  ShoppingCart, Heart, Star, ArrowRight, ArrowLeft, Menu, X, 
  Search, Bell, Settings, LogOut, CreditCard, Truck, MapPin, 
  Phone, Calendar, Clock, Play, Square, Volume2, VolumeX,
  Facebook, Twitter, Instagram, Linkedin, ChevronRight, ChevronDown,
  Home, BookOpen, Users, PenTool, Briefcase, Info, HelpCircle,
  Share2, Bookmark, Filter, Grid, List, ChevronUp, Plus, Minus,
  Trash2, Edit, ExternalLink, Copy, Check, XCircle, Loader2
} from 'lucide-react';

const IconMap = {
  'fa-eye': Eye,
  'fa-eye-slash': EyeOff,
  'fa-check-circle': CheckCircle,
  'fa-exclamation-circle': AlertCircle,
  'fa-user': User,
  'fa-envelope': Mail,
  'fa-lock': Lock,
  'fa-shopping-cart': ShoppingCart,
  'fa-heart': Heart,
  'fa-star': Star,
  'fa-arrow-right': ArrowRight,
  'fa-arrow-left': ArrowLeft,
  'fa-bars': Menu,
  'fa-times': X,
  'fa-search': Search,
  'fa-bell': Bell,
  'fa-cog': Settings,
  'fa-sign-out-alt': LogOut,
  'fa-credit-card': CreditCard,
  'fa-truck': Truck,
  'fa-map-marker-alt': MapPin,
  'fa-phone': Phone,
  'fa-calendar': Calendar,
  'fa-clock': Clock,
  'fa-play': Play,
  'fa-pause': Square,
  'fa-volume-up': Volume2,
  'fa-volume-mute': VolumeX,
  'fa-facebook': Facebook,
  'fa-twitter': Twitter,
  'fa-instagram': Instagram,
  'fa-linkedin': Linkedin,
  'fa-chevron-right': ChevronRight,
  'fa-chevron-down': ChevronDown,
  'fa-home': Home,
  'fa-book': BookOpen,
  'fa-users': Users,
  'fa-pen': PenTool,
  'fa-briefcase': Briefcase,
  'fa-info-circle': Info,
  'fa-question-circle': HelpCircle,
  'fa-share-alt': Share2,
  'fa-bookmark': Bookmark,
  'fa-filter': Filter,
  'fa-th': Grid,
  'fa-list': List,
  'fa-chevron-up': ChevronUp,
  'fa-plus': Plus,
  'fa-minus': Minus,
  'fa-trash': Trash2,
  'fa-edit': Edit,
  'fa-external-link-alt': ExternalLink,
  'fa-copy': Copy,
  'fa-check': Check,
  'fa-times-circle': XCircle,
  'fa-spinner': Loader2,
};

const Icon = ({ name, size = 16, className = '', ...props }) => {
  const LucideIcon = IconMap[name];
  
  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in IconMap`);
    return null;
  }
  
  return <LucideIcon size={size} className={className} {...props} />;
};

export default Icon;
