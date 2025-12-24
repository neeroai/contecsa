/**
 * Consorcios Data Generator
 * Contecsa Sistema de Inteligencia de Datos
 *
 * Version: 1.0 | Date: 2025-12-24 13:00
 *
 * Generates 9 fixed consorcios as specified in requirements:
 * PAVICONSTRUJC, EDUBAR-KRA50, PTAR, HIDROCARIBE, VIAL60, etc.
 * With budgets, timelines, and EVM metrics.
 */

import type {
  Budget,
  BudgetLine,
  Consortium,
  ConsortiumMember,
  EVMMetrics,
  Forecast,
  Project,
  ProjectStatus,
} from '../types';
import { getUsersByRole } from './users';
import {
  COLOMBIAN_CITIES,
  addMonths,
  deterministicUUID,
  formatMonth,
  generateEmail,
  generatePhone,
  getCurrentDate,
  rng,
  subtractMonths,
} from './utils';

/**
 * Generate consortium members
 */
function generateConsortiumMembers(
  consortiumId: string,
  memberCompanies: { name: string; participation: number }[],
): ConsortiumMember[] {
  return memberCompanies.map((company, index) => ({
    id: deterministicUUID(`${consortiumId}-member-${index}`),
    consortiumId,
    organizationName: company.name,
    participationPercentage: company.participation,
    contactPerson: `${rng.pick(['Carlos', 'María', 'Jorge', 'Ana'])} ${rng.pick(['Pérez', 'González', 'Martínez', 'López'])}`,
    email: generateEmail(
      rng.pick(['Carlos', 'María', 'Jorge', 'Ana']),
      rng.pick(['Pérez', 'González', 'Martínez', 'López']),
      company.name.toLowerCase().replace(/\s+/g, '') + '.com',
    ),
    phone: generatePhone(true),
    joinedDate: subtractMonths(getCurrentDate(), rng.int(12, 36)),
  }));
}

/**
 * Generate EVM metrics for a project
 */
function generateEVMMetrics(
  budgetValue: number,
  completionPercentage: number,
  performanceVariance = 0,
): EVMMetrics {
  const plannedValue = budgetValue * (completionPercentage / 100);
  const earnedValue = plannedValue * (1 + performanceVariance / 100);
  const actualCost = earnedValue * rng.float(0.95, 1.08);

  const cpi = actualCost > 0 ? earnedValue / actualCost : 1;
  const spi = plannedValue > 0 ? earnedValue / plannedValue : 1;

  const eac = budgetValue / cpi;
  const etc = eac - actualCost;
  const vac = budgetValue - eac;
  const cv = earnedValue - actualCost;
  const sv = earnedValue - plannedValue;

  return {
    plannedValue,
    earnedValue,
    actualCost,
    cpi,
    spi,
    eac,
    etc,
    vac,
    cv,
    sv,
    calculatedAt: getCurrentDate(),
  };
}

/**
 * Generate budget lines
 */
function generateBudgetLines(totalBudget: number): BudgetLine[] {
  const categories = [
    { name: 'Materiales', percentage: 40 },
    { name: 'Mano de Obra', percentage: 30 },
    { name: 'Equipos', percentage: 15 },
    { name: 'Subcontratos', percentage: 10 },
    { name: 'Administración', percentage: 5 },
  ];

  return categories.map((cat, index) => {
    const plannedAmount = totalBudget * (cat.percentage / 100);
    const executedAmount = plannedAmount * rng.float(0.4, 0.9);
    const remainingAmount = plannedAmount - executedAmount;
    const variance = ((executedAmount - plannedAmount) / plannedAmount) * 100;

    return {
      id: deterministicUUID(`budget-line-${index}`),
      category: cat.name,
      description: `Presupuesto para ${cat.name.toLowerCase()}`,
      plannedAmount,
      executedAmount,
      remainingAmount,
      variance,
      lastUpdated: getCurrentDate(),
    };
  });
}

/**
 * Generate budget
 */
function generateBudget(projectId: string, totalBudget: number): Budget {
  const budgetLines = generateBudgetLines(totalBudget);
  const executedBudget = budgetLines.reduce((sum, line) => sum + line.executedAmount, 0);
  const committedBudget = totalBudget * rng.float(0.15, 0.25);
  const availableBudget = totalBudget - executedBudget - committedBudget;
  const budgetUtilization = (executedBudget / totalBudget) * 100;

  return {
    id: deterministicUUID(`budget-${projectId}`),
    projectId,
    totalBudget,
    approvedBudget: totalBudget,
    executedBudget,
    committedBudget,
    availableBudget,
    budgetLines,
    budgetUtilization,
    lastUpdated: getCurrentDate(),
  };
}

/**
 * Generate forecasts
 */
function generateForecasts(): Forecast[] {
  const forecasts: Forecast[] = [];
  const currentDate = getCurrentDate();

  for (let i = 1; i <= 6; i++) {
    const period = formatMonth(addMonths(currentDate, i));
    forecasts.push({
      period,
      forecastedExpenses: rng.int(50000000, 200000000),
      confidence: rng.int(70, 95),
      projectedCashFlow: rng.int(-50000000, 100000000),
      riskAdjustment: rng.float(-10, 10),
      notes: i === 1 ? 'Mes próximo - alta confianza' : undefined,
    });
  }

  return forecasts;
}

/**
 * Generate a single project
 */
function generateProject(
  consortium: Consortium,
  projectName: string,
  projectCode: string,
  status: ProjectStatus,
  budgetValue: number,
  completionPercentage: number,
): Project {
  const projectId = deterministicUUID(`project-${projectCode}`);
  const startDate = subtractMonths(getCurrentDate(), rng.int(6, 24));
  const durationDays = rng.int(180, 720);
  const endDate = addMonths(startDate, Math.floor(durationDays / 30));

  const gerenciaUsers = getUsersByRole('gerencia');
  const tecnicoUsers = getUsersByRole('tecnico');
  const projectManager = rng.pick(gerenciaUsers);
  const technicalLead = rng.pick(tecnicoUsers);

  const budget = generateBudget(projectId, budgetValue);
  const evmMetrics = generateEVMMetrics(budgetValue, completionPercentage);
  const forecasts = generateForecasts();

  const scheduleHealth: 'ON_TRACK' | 'AT_RISK' | 'OFF_TRACK' =
    evmMetrics.spi >= 0.95 ? 'ON_TRACK' : evmMetrics.spi >= 0.85 ? 'AT_RISK' : 'OFF_TRACK';

  const budgetHealth: 'ON_TRACK' | 'AT_RISK' | 'OFF_TRACK' =
    evmMetrics.cpi >= 0.95 ? 'ON_TRACK' : evmMetrics.cpi >= 0.85 ? 'AT_RISK' : 'OFF_TRACK';

  const riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' =
    scheduleHealth === 'OFF_TRACK' || budgetHealth === 'OFF_TRACK'
      ? 'HIGH'
      : scheduleHealth === 'AT_RISK' || budgetHealth === 'AT_RISK'
        ? 'MEDIUM'
        : 'LOW';

  return {
    id: projectId,
    consortiumId: consortium.id,
    consortiumName: consortium.name,
    name: projectName,
    code: projectCode,
    status,
    startDate,
    endDate,
    projectedEndDate: status === 'ACTIVE' ? addMonths(endDate, rng.int(-2, 2)) : undefined,
    actualEndDate: status === 'COMPLETED' || status === 'CLOSED' ? endDate : undefined,
    durationDays,
    completionPercentage,
    location: consortium.location,
    address: consortium.location,
    city: rng.pick(COLOMBIAN_CITIES),
    country: 'Colombia',
    budget,
    estimatedValue: budgetValue,
    actualValue: evmMetrics.actualCost,
    forecasts,
    nextForecastPeriod: formatMonth(addMonths(getCurrentDate(), 1)),
    evmMetrics,
    scheduleHealth,
    budgetHealth,
    projectManager: `${projectManager.firstName} ${projectManager.lastName}`,
    projectManagerId: projectManager.id,
    technicalLead: `${technicalLead.firstName} ${technicalLead.lastName}`,
    technicalLeadId: technicalLead.id,
    teamSize: rng.int(15, 50),
    materialCategories: ['CEMENTO', 'ACERO', 'HORMIGON', 'ARENA', 'GRAVA'],
    estimatedMaterialCost: budgetValue * 0.4,
    actualMaterialCost: evmMetrics.actualCost * 0.4,
    riskLevel,
    riskDescription: riskLevel === 'HIGH' ? 'Retrasos en cronograma y sobrecostos' : undefined,
    description: `Proyecto de ${projectName}`,
    tags: [status, consortium.code],
    createdAt: subtractMonths(getCurrentDate(), 24),
    updatedAt: getCurrentDate(),
    createdBy: projectManager.id,
  };
}

/**
 * Generate a consortium
 */
function generateConsortium(
  name: string,
  code: string,
  description: string,
  location: string,
  clientName: string,
  contractValue: number,
  memberCompanies: { name: string; participation: number }[],
): Consortium {
  const id = deterministicUUID(`consortium-${code}`);
  const members = generateConsortiumMembers(id, memberCompanies);
  const startDate = subtractMonths(getCurrentDate(), rng.int(12, 36));
  const endDate = addMonths(startDate, rng.int(24, 60));

  return {
    id,
    name,
    code,
    description,
    members,
    status: 'ACTIVE',
    startDate,
    endDate,
    location,
    clientName,
    contractValue,
    projectCount: rng.int(2, 5),
    createdAt: subtractMonths(startDate, 3),
    updatedAt: getCurrentDate(),
  };
}

/**
 * Generates all 9 consorcios
 */
export function generateConsorcios(): Consortium[] {
  return [
    generateConsortium(
      'PAVICONSTRUJC',
      'PAVIJC',
      'Consorcio para pavimentación urbana',
      'Bogotá',
      'IDU - Instituto de Desarrollo Urbano',
      15000000000,
      [
        { name: 'Contecsa', participation: 60 },
        { name: 'Constructora JC', participation: 40 },
      ],
    ),

    generateConsortium(
      'EDUBAR-KRA50',
      'EDUBAR',
      'Construcción de colegios en Barranquilla',
      'Barranquilla',
      'Secretaría de Educación Distrital',
      8500000000,
      [
        { name: 'Contecsa', participation: 55 },
        { name: 'Constructora Barranquilla', participation: 45 },
      ],
    ),

    generateConsortium(
      'PTAR',
      'PTAR',
      'Planta de Tratamiento de Aguas Residuales',
      'Cartagena',
      'Aguas de Cartagena',
      25000000000,
      [
        { name: 'Contecsa', participation: 50 },
        { name: 'Hidrotec', participation: 30 },
        { name: 'AmbientalCo', participation: 20 },
      ],
    ),

    generateConsortium(
      'HIDROCARIBE',
      'HIDRO',
      'Obras hidráulicas en la costa caribe',
      'Santa Marta',
      'Cormagdalena',
      12000000000,
      [
        { name: 'Contecsa', participation: 65 },
        { name: 'Ingeniería Caribe', participation: 35 },
      ],
    ),

    generateConsortium(
      'VIAL60',
      'VIAL60',
      'Corredor vial nacional ruta 60',
      'Medellín',
      'ANI - Agencia Nacional de Infraestructura',
      35000000000,
      [
        { name: 'Contecsa', participation: 45 },
        { name: 'Vías de Colombia', participation: 35 },
        { name: 'Pavimentos del Norte', participation: 20 },
      ],
    ),

    generateConsortium(
      'PUENTE-MAGDALENA',
      'PMAG',
      'Construcción puente sobre río Magdalena',
      'Girardot',
      'Invías',
      18000000000,
      [
        { name: 'Contecsa', participation: 55 },
        { name: 'Estructuras Metálicas', participation: 45 },
      ],
    ),

    generateConsortium(
      'TUNELES-ORIENTE',
      'TUNOR',
      'Sistema de túneles Bogotá-Villavicencio',
      'Villavicencio',
      'ANI',
      42000000000,
      [
        { name: 'Contecsa', participation: 40 },
        { name: 'Túneles de Colombia', participation: 35 },
        { name: 'Ingenieros Civiles Asociados', participation: 25 },
      ],
    ),

    generateConsortium(
      'METRO-BOGOTA',
      'METRO',
      'Primera línea del metro de Bogotá',
      'Bogotá',
      'Metro de Bogotá S.A.',
      65000000000,
      [
        { name: 'Contecsa', participation: 30 },
        { name: 'Metro Constructores', participation: 40 },
        { name: 'Infraestructura Urbana', participation: 30 },
      ],
    ),

    generateConsortium(
      'PARQUE-INDUSTRIAL-CALI',
      'PICALI',
      'Desarrollo parque industrial zona franca',
      'Cali',
      'Invest Pacific',
      22000000000,
      [
        { name: 'Contecsa', participation: 60 },
        { name: 'Desarrollos Industriales', participation: 40 },
      ],
    ),
  ];
}

/**
 * Generate projects for all consorcios
 */
export function generateProjects(): Project[] {
  const consorcios = CONSORCIOS;
  const projects: Project[] = [];

  // Generate 1-2 projects per consortium (total ~15 projects)
  consorcios.forEach((consortium) => {
    const projectCount = rng.int(1, 2);

    for (let i = 0; i < projectCount; i++) {
      const projectName = `${consortium.name} - Fase ${i + 1}`;
      const projectCode = `${consortium.code}-P${i + 1}`;
      const status: ProjectStatus = rng.pick([
        'PLANNING',
        'ACTIVE',
        'ACTIVE',
        'ACTIVE',
        'COMPLETED',
      ]);
      const budgetValue = consortium.contractValue / consortium.projectCount;
      const completionPercentage = status === 'COMPLETED' ? 100 : rng.int(25, 85);

      projects.push(
        generateProject(
          consortium,
          projectName,
          projectCode,
          status,
          budgetValue,
          completionPercentage,
        ),
      );
    }
  });

  return projects;
}

/**
 * Pre-generated data
 */
export const CONSORCIOS = generateConsorcios();
export const PROJECTS = generateProjects();

/**
 * Helper: Get consortium by code
 */
export function getConsortiumByCode(code: string): Consortium | undefined {
  return CONSORCIOS.find((c) => c.code === code);
}

/**
 * Helper: Get projects by consortium
 */
export function getProjectsByConsortium(consortiumId: string): Project[] {
  return PROJECTS.filter((p) => p.consortiumId === consortiumId);
}

/**
 * Helper: Get random project
 */
export function getRandomProject(): Project {
  return rng.pick(PROJECTS);
}
